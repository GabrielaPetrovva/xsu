import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".git", ".vscode"].includes(entry.name)) return [];
      return walk(full);
    }
    return [full];
  });
}

const htmlFiles = fs.readdirSync(ROOT).filter((name) => name.endsWith(".html"));
const knownPages = new Set(htmlFiles);

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");
  if (!html.includes('name="description"')) errors.push(`${file}: missing meta description`);
  if (!html.includes('rel="canonical"')) errors.push(`${file}: missing canonical`);
  if (!html.includes("application/ld+json")) errors.push(`${file}: missing structured data`);
  if (html.includes("127.0.0.1") || html.includes(":5500")) errors.push(`${file}: contains development host`);
  if (!html.includes("site-config.js")) errors.push(`${file}: missing site-config.js`);

  const hrefs = [...html.matchAll(/href="([^"]+\.html)(?:#[^"]*)?"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    if (/^https?:/i.test(href)) continue;
    const target = href.split("#")[0];
    if (!knownPages.has(target)) errors.push(`${file}: broken link to ${target}`);
  }
}

const favicons = [
  "images/favicon/favicon.ico",
  "images/favicon/favicon.svg",
  "images/favicon/favicon-96x96.png",
  "images/favicon/apple-touch-icon.png",
  "images/favicon/web-app-manifest-192x192.png",
  "images/favicon/web-app-manifest-512x512.png",
  "images/og-share.jpg",
  "robots.txt",
  "sitemap.xml",
];
for (const file of favicons) {
  if (!fs.existsSync(path.join(ROOT, file))) errors.push(`missing file: ${file}`);
}

for (const file of walk(ROOT)) {
  if (!/\.(html|js|css|json|xml|txt|webmanifest)$/i.test(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  if (text.includes("127.0.0.1:5500") || text.includes("127.0.0.1")) {
    errors.push(`${path.relative(ROOT, file)}: development host reference`);
  }
}

if (warnings.length) {
  console.warn("Warnings:\n" + warnings.map((w) => `- ${w}`).join("\n"));
}
if (errors.length) {
  console.error("Build check failed:\n" + errors.map((e) => `- ${e}`).join("\n"));
  process.exit(1);
}
console.log(`Checked ${htmlFiles.length} pages. No errors.`);
