import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCHOOL = "СУ „Йордан Йовков“ – Сливен";
const DEFAULT_IMAGE = "images/og-share.jpg";

const PAGES = {
  "index.html": {
    title: `${SCHOOL}`,
    description: "Официален сайт на СУ „Йордан Йовков“ – Сливен. Информация за прием, обучение, новини, документи и контакти на училището.",
  },
  "za-nas.html": {
    title: `За нас | ${SCHOOL}`,
    description: "Запознайте се с историята, патрона, мисията, екипа и материалната база на СУ „Йордан Йовков“ в Сливен.",
  },
  "patron.html": {
    title: `Патрон – Йордан Йовков | ${SCHOOL}`,
    description: "Страница за патрона на училището — писателя Йордан Йовков, неговото творчество и връзката му с училището в Сливен.",
  },
  "himn.html": {
    title: `Химн | ${SCHOOL}`,
    description: "Текст и информация за химна на СУ „Йордан Йовков“ – Сливен.",
  },
  "istoriq.html": {
    title: `История | ${SCHOOL}`,
    description: "История на СУ „Йордан Йовков“ – Сливен от основаването през 1980 г. до днес.",
  },
  "misiq-viziq.html": {
    title: `Мисия и визия | ${SCHOOL}`,
    description: "Мисия, визия и образователни приоритети на СУ „Йордан Йовков“ – Сливен.",
  },
  "virtualna-razhodka.html": {
    title: `Виртуална разходка | ${SCHOOL}`,
    description: "Виртуална разходка из сградата и кабинетите на СУ „Йордан Йовков“ – Сливен.",
  },
  "ekip.html": {
    title: `Педагогически екип | ${SCHOOL}`,
    description: "Педагогическият екип на СУ „Йордан Йовков“ – Сливен: ръководство, учители и специалисти.",
  },
  "paralelki.html": {
    title: `Паралелки | ${SCHOOL}`,
    description: "Информация за паралелките и профилите в СУ „Йордан Йовков“ – Сливен.",
  },
  "materialna-baza.html": {
    title: `Материална база | ${SCHOOL}`,
    description: "Кабинети, лаборатории, спортна база и други помещения на СУ „Йордан Йовков“ – Сливен.",
  },
  "uniformi.html": {
    title: `Униформи | ${SCHOOL}`,
    description: "Информация за училищните униформи на СУ „Йордан Йовков“ – Сливен.",
  },
  "priem.html": {
    title: `Прием | ${SCHOOL}`,
    description: "Прием в I, V и VIII клас в СУ „Йордан Йовков“ – Сливен: условия, документи и често задавани въпроси.",
  },
  "priem-1-klas.html": {
    title: `Прием в I клас | ${SCHOOL}`,
    description: "Условия и информация за прием в I клас в СУ „Йордан Йовков“ – Сливен.",
  },
  "priem-5-klas.html": {
    title: `Прием в V клас | ${SCHOOL}`,
    description: "Условия и информация за прием в V клас в СУ „Йордан Йовков“ – Сливен.",
  },
  "priem-8-klas.html": {
    title: `Прием в VIII клас | ${SCHOOL}`,
    description: "Условия и информация за прием в VIII клас в СУ „Йордан Йовков“ – Сливен.",
  },
  "dokumenti-priem.html": {
    title: `Необходими документи за прием | ${SCHOOL}`,
    description: "Необходими документи за кандидатстване и записване в СУ „Йордан Йовков“ – Сливен.",
  },
  "faq.html": {
    title: `Често задавани въпроси | ${SCHOOL}`,
    description: "Отговори на често задавани въпроси за прием, обучение и администрация в СУ „Йордан Йовков“ – Сливен.",
  },
  "obuchenie.html": {
    title: `Обучение | ${SCHOOL}`,
    description: "Информация за учебния процес, учебници и учебни планове в СУ „Йордан Йовков“ – Сливен.",
  },
  "uchebnici.html": {
    title: `Учебници | ${SCHOOL}`,
    description: "Списък и информация за учебниците, използвани в СУ „Йордан Йовков“ – Сливен.",
  },
  "uchebni-planove.html": {
    title: `Учебни планове | ${SCHOOL}`,
    description: "Учебни планове на СУ „Йордан Йовков“ – Сливен по етапи и паралелки.",
  },
  "roditeli.html": {
    title: `Родители | ${SCHOOL}`,
    description: "Информация и полезни връзки за родители на ученици от СУ „Йордан Йовков“ – Сливен.",
  },
  "roditelski-sreshti.html": {
    title: `Родителски срещи | ${SCHOOL}`,
    description: "График и информация за родителски срещи в СУ „Йордан Йовков“ – Сливен.",
  },
  "uchenici.html": {
    title: `Ученици | ${SCHOOL}`,
    description: "Разписания, ваканции, консултации, извънкласни дейности и информация за учениците на СУ „Йордан Йовков“ – Сливен.",
  },
  "dnevno-razpisanie.html": {
    title: `Дневно разписание | ${SCHOOL}`,
    description: "Дневно разписание на учебните часове в СУ „Йордан Йовков“ – Сливен.",
  },
  "sedmichno-razpisanie.html": {
    title: `Седмично разписание | ${SCHOOL}`,
    description: "Седмично разписание на часовете в СУ „Йордан Йовков“ – Сливен.",
  },
  "pochivni-dni.html": {
    title: `Почивни дни и ваканции | ${SCHOOL}`,
    description: "Учебни срокове, ваканции и почивни дни за СУ „Йордан Йовков“ – Сливен.",
  },
  "klasni-kontrolni.html": {
    title: `Графици за класни и контролни | ${SCHOOL}`,
    description: "Графици за класни и контролни работи в СУ „Йордан Йовков“ – Сливен.",
  },
  "konsultacii.html": {
    title: `Консултации | ${SCHOOL}`,
    description: "График за консултации с учители в СУ „Йордан Йовков“ – Сливен.",
  },
  "uchenicheski-suvet.html": {
    title: `Ученически съвет | ${SCHOOL}`,
    description: "Информация за ученическия съвет на СУ „Йордан Йовков“ – Сливен.",
  },
  "izvunklasni-deinosti.html": {
    title: `Извънкласни дейности | ${SCHOOL}`,
    description: "Клубове, занимания по интереси и извънкласни дейности в СУ „Йордан Йовков“ – Сливен.",
  },
  "nvo.html": {
    title: `Национално външно оценяване | ${SCHOOL}`,
    description: "Информация за НВО в СУ „Йордан Йовков“ – Сливен.",
  },
  "dzi.html": {
    title: `Държавни зрелостни изпити | ${SCHOOL}`,
    description: "Информация за ДЗИ в СУ „Йордан Йовков“ – Сливен.",
  },
  "proekti.html": {
    title: `Проекти | ${SCHOOL}`,
    description: "Национални програми и проекти, в които участва СУ „Йордан Йовков“ – Сливен.",
  },
  "novini.html": {
    title: `Новини | ${SCHOOL}`,
    description: "Новини, събития и постижения от живота на СУ „Йордан Йовков“ – Сливен.",
  },
  "statiq.html": {
    title: `Национално отличие за ученици | ${SCHOOL}`,
    description: "Ученици от СУ „Йордан Йовков“ – Сливен завоюваха второ място в националния конкурс „Аз и изкуственият интелект след 10 години“.",
    type: "article",
    image: "images/concurs.jpg",
  },
  "dokumenti.html": {
    title: `Документи | ${SCHOOL}`,
    description: "Правилници, формуляри, бюджетни отчети и училищни документи на СУ „Йордан Йовков“ – Сливен.",
  },
  "pravilnici.html": {
    title: `Правилници | ${SCHOOL}`,
    description: "Училищни правилници и вътрешни актове на СУ „Йордан Йовков“ – Сливен.",
  },
  "stipendii.html": {
    title: `Стипендии | ${SCHOOL}`,
    description: "Информация за стипендии за ученици на СУ „Йордан Йовков“ – Сливен.",
  },
  "budget-otcheti.html": {
    title: `Бюджет и отчети | ${SCHOOL}`,
    description: "Бюджет и отчети за изпълнението му на СУ „Йордан Йовков“ – Сливен.",
  },
  "uchilishtni-dokumenti.html": {
    title: `Училищни документи | ${SCHOOL}`,
    description: "Стратегии, планове и други училищни документи на СУ „Йордан Йовков“ – Сливен.",
  },
  "formulari.html": {
    title: `Формуляри | ${SCHOOL}`,
    description: "Формуляри и бланки за родители и ученици на СУ „Йордан Йовков“ – Сливен.",
  },
  "kontakti.html": {
    title: `Контакти | ${SCHOOL}`,
    description: "Адрес, телефони, имейл и контактна форма на СУ „Йордан Йовков“ – Сливен, кв. „Българка“.",
  },
  "poveritelnost.html": {
    title: `Политика за поверителност | ${SCHOOL}`,
    description: "Как СУ „Йордан Йовков“ – Сливен обработва лични данни, съгласно GDPR и приложимото законодателство.",
  },
  "dostapnost.html": {
    title: `Достъпност | ${SCHOOL}`,
    description: "Информация за достъпността на сайта на СУ „Йордан Йовков“ – Сливен.",
  },
  "usloviya.html": {
    title: `Условия за ползване | ${SCHOOL}`,
    description: "Условия за ползване на официалния сайт на СУ „Йордан Йовков“ – Сливен.",
  },
  "razrabotva-se.html": {
    title: `Страница в разработка | ${SCHOOL}`,
    description: "Тази страница на сайта на СУ „Йордан Йовков“ – Сливен все още се подготвя.",
    robots: "noindex,follow",
  },
  "404.html": {
    title: `Страницата не е намерена | ${SCHOOL}`,
    description: "Поисканата страница не съществува на сайта на СУ „Йордан Йовков“ – Сливен.",
    robots: "noindex,follow",
  },
};

function readSiteConfig() {
  const source = fs.readFileSync(path.join(ROOT, "assets/js/site-config.js"), "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox);
  return sandbox.window.__XSU_SITE__ || { origin: "" };
}

function schemaJson(file, meta, origin) {
  const pageUrl = origin ? `${origin}/${file === "index.html" ? "" : file}` : file;
  const image = origin ? `${origin}/${meta.image || DEFAULT_IMAGE}` : (meta.image || DEFAULT_IMAGE);
  const org = {
    "@type": ["EducationalOrganization", "School"],
    name: SCHOOL,
    alternateName: "СУ Йордан Йовков Сливен",
    address: {
      "@type": "PostalAddress",
      streetAddress: "кв. „Българка“",
      addressLocality: "Сливен",
      postalCode: "8808",
      addressCountry: "BG",
    },
    telephone: "+35944667244",
    email: "info-2000114@edu.mon.bg",
    sameAs: [
      "https://www.facebook.com/SUYordanYovkov",
      "https://www.youtube.com/@%D0%A1%D0%A3%D0%99%D0%BE%D1%80%D0%B4%D0%B0%D0%BD%D0%99%D0%BE%D0%B2%D0%BA%D0%BE%D0%B2",
      "https://www.tiktok.com/@x_su_sliven",
    ],
  };
  if (origin) org.url = origin + "/";
  const webpage = {
    "@type": meta.type === "article" ? "NewsArticle" : "WebPage",
    name: meta.title,
    headline: meta.title,
    description: meta.description,
    inLanguage: "bg",
    isPartOf: { "@type": "WebSite", name: SCHOOL },
    about: org,
  };
  if (origin) {
    webpage.url = pageUrl;
    webpage.image = image;
    webpage.isPartOf.url = origin + "/";
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": [org, webpage] });
}

function seoBlock(file, meta, origin) {
  const canonical = origin ? `${origin}/${file === "index.html" ? "" : file}` : file;
  const image = origin ? `${origin}/${meta.image || DEFAULT_IMAGE}` : (meta.image || DEFAULT_IMAGE);
  const robots = meta.robots || "index,follow";
  const type = meta.type === "article" ? "article" : "website";
  return `  <!-- site-seo:start -->
  <meta name="description" content="${escapeHtml(meta.description)}">
  <meta name="robots" content="${robots}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="${type}">
  <meta property="og:locale" content="bg_BG">
  <meta property="og:site_name" content="${escapeHtml(SCHOOL)}">
  <meta property="og:title" content="${escapeHtml(meta.title)}">
  <meta property="og:description" content="${escapeHtml(meta.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:alt" content="${escapeHtml(SCHOOL)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(meta.title)}">
  <meta name="twitter:description" content="${escapeHtml(meta.description)}">
  <meta name="twitter:image" content="${image}">
  <link rel="icon" type="image/png" href="images/favicon/favicon-96x96.png" sizes="96x96">
  <link rel="icon" type="image/svg+xml" href="images/favicon/favicon.svg">
  <link rel="shortcut icon" href="images/favicon/favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="images/favicon/apple-touch-icon.png">
  <link rel="manifest" href="images/favicon/site.webmanifest">
  <meta name="theme-color" content="#0f5438">
  <meta name="apple-mobile-web-app-title" content="СУ Йордан Йовков">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <script type="application/ld+json">${schemaJson(file, meta, origin)}</script>
  <!-- site-seo:end -->`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;");
}

function patchHead(html, file, meta, origin) {
  let next = html.replace(/\s*<!-- site-seo:start -->[\s\S]*?<!-- site-seo:end -->\s*/g, "\n");
  next = next.replace(
    /<link rel="icon"[\s\S]*?href="\/images\/favicon\/site\.webmanifest"\s*\/>\s*/g,
    ""
  );
  next = next.replace(
    /<link rel="icon"[\s\S]*?href="images\/favicon\/site\.webmanifest"\s*>\s*/g,
    ""
  );
  if (meta.title) {
    next = next.replace(/<title>[\s\S]*?<\/title>/, `<title>${meta.title}</title>`);
  }
  if (!next.includes('href="https://fonts.gstatic.com"')) {
    next = next.replace(
      '<link rel="preconnect" href="https://fonts.googleapis.com">',
      '<link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    );
  }
  next = next.replace(/<\/title>/, `</title>\n${seoBlock(file, meta, origin)}`);
  if (!next.includes("assets/js/site-config.js")) {
    if (/<script type="module" src="assets\/js\/main\.js"(?:\s+defer)?><\/script>/.test(next)) {
      next = next.replace(
        /<script type="module" src="assets\/js\/main\.js"(?:\s+defer)?><\/script>/,
        '<script src="assets/js/site-config.js"></script>\n  <script type="module" src="assets/js/main.js"></script>'
      );
    } else if (next.includes('<script src="assets/js/components-init.js"></script>')) {
      next = next.replace(
        '<script src="assets/js/components-init.js"></script>',
        '<script src="assets/js/site-config.js"></script>\n  <script type="module" src="assets/js/main.js"></script>\n  <script src="assets/js/components-init.js"></script>'
      );
    }
  }
  return next;
}

function writeSitemap(origin) {
  const files = Object.entries(PAGES).filter(([, meta]) => !(meta.robots || "").includes("noindex"));
  const locs = files.map(([file]) => {
    const loc = origin
      ? `${origin.replace(/\/$/, "")}/${file === "index.html" ? "" : file}`
      : file;
    return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Ако origin в assets/js/site-config.js е празен, адресите са относителни. Задайте реалния домейн и изпълнете npm run build. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locs.join("\n")}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml);
}

function writeRobots(origin) {
  const sitemap = origin ? `${origin.replace(/\/$/, "")}/sitemap.xml` : "sitemap.xml";
  fs.writeFileSync(
    path.join(ROOT, "robots.txt"),
    `User-agent: *
Allow: /

Disallow: /razrabotva-se.html
Disallow: /404.html
Disallow: /assets/components/

Sitemap: ${sitemap}
`
  );
}

const { origin } = readSiteConfig();
const htmlFiles = fs.readdirSync(ROOT).filter((name) => name.endsWith(".html"));
for (const file of htmlFiles) {
  const meta = PAGES[file];
  if (!meta) {
    console.warn(`No SEO map for ${file}`);
    continue;
  }
  const full = path.join(ROOT, file);
  const html = fs.readFileSync(full, "utf8");
  fs.writeFileSync(full, patchHead(html, file, meta, origin.replace(/\/$/, "")));
}

writeSitemap(origin.replace(/\/$/, ""));
writeRobots(origin.replace(/\/$/, ""));
console.log(`Updated ${htmlFiles.length} HTML pages, sitemap.xml and robots.txt`);
