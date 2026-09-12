/**
 * faq-bot.js — FAQ асистент на СУ „Йордан Йовков"
 * Работи изцяло client-side, без API.
 */

function normalizeText(value) {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Knowledge base ────────────────────────────────────────────────────────────
// Реално съдържание, извлечено от страниците на сайта.

function createKnowledgeBase() {
  return [

    // ── ОБЩО ЗА УЧИЛИЩЕТО ──────────────────────────────────────────────────
    {
      id: 'about',
      keywords: ['йордан йовков', 'училище', 'су', 'какво е', 'за нас', 'основано', 'история', 'кога е', 'колко години', 'разкажи', 'информация'],
      answer: [
        'СУ „Йордан Йовков" е едно от утвърдените средни учебни заведения в Сливен. Основано е на 15 септември 1980 г. в кв. „Българка". Мотото ни е „Ако успееш тук, ще успееш навсякъде!" — и го доказваме всеки ден.',
        'Нашето училище е основано през 1980 г. в кв. „Българка", Сливен. Носим името на великия български писател Йордан Йовков — от 18 септември 1980 г., по повод 100-годишнината от рождението му. Днес обучаваме над 800 ученици.',
      ],
      href: 'za-nas.html',
    },

    {
      id: 'stats',
      keywords: ['колко ученика', 'брой ученици', 'колко учители', 'колко паралелки', 'статистика', 'числа'],
      answer: [
        'Училището има над 800 ученици, 37+ педагози и специалисти, 14 паралелки от I до XII клас и 30+ учебни кабинета. Иновативно училище сме вече повече от 10 години.',
      ],
      href: 'za-nas.html',
    },

    {
      id: 'location',
      keywords: ['адрес', 'къде се намира', 'местоположение', 'квартал', 'карта', 'как да стигна'],
      answer: [
        'Намираме се в кв. „Българка", гр. Сливен 8808. Може да ни намериш и в Google Maps — търси „СУ Йордан Йовков Сливен".',
      ],
      href: 'kontakti.html',
    },

    // ── ПАТРОН ─────────────────────────────────────────────────────────────
    {
      id: 'patron',
      keywords: ['патрон', 'йовков', 'кой е', 'писател', 'биография', 'роден', 'жеравна', 'разкази'],
      answer: [
        'Нашият патрон е Йордан Йовков — роден на 9 ноември 1880 г. в с. Жеравна, Сливенско. Майстор на късия разказ, певец на красотата и хуманизма, класик на българската литература. Учителят му предсказал: „Имате бъдещ писател с тънка и дълбока наблюдателност."',
        'Йордан Йовков е роден в Жеравна, учил в София, учителствал в Добруджа. Класик на българската литература и вдъхновяващ патрон на нашето училище. Повече за живота и творчеството му — на страницата „Патрон".',
      ],
      href: 'patron.html',
    },

    // ── ХИМН ───────────────────────────────────────────────────────────────
    {
      id: 'himn',
      keywords: ['химн', 'песен', 'текст', 'думи', 'мелодия', 'камъни сини', 'българка'],
      answer: [
        'Химнът на училището е с думи от Христо Батинков и музика от Иван Кавръков. Припевът: „Над нас сияят камъните сини и Българка е нашият квартал." Изпълнява се на тържествени събрания. Може да го послушаш на страницата „Химн".',
      ],
      href: 'himn.html',
    },

    // ── МИСИЯ И ВИЗИЯ ──────────────────────────────────────────────────────
    {
      id: 'mission',
      keywords: ['мисия', 'визия', 'ценности', 'цели', 'иновативно', 'програмиране', 'дигитални'],
      answer: [
        'Мисията ни е „Обучение с гаранция за успех" — качествено образование, ориентирано към дигиталните технологии. От начален етап с „Въведение във визуалното програмиране", през КМИТ в прогимназиален, до специалност „Интелигентни системи" в гимназиален — осигуряваме пълна програмна линия.',
      ],
      href: 'misiq-viziq.html',
    },

    // ── ЕКИП ───────────────────────────────────────────────────────────────
    {
      id: 'team',
      keywords: ['директор', 'екип', 'учители', 'педагози', 'ръководство', 'кой е директор', 'диана'],
      answer: [
        'Директор на СУ „Йордан Йовков" е Диана Кънева. Зам.-директори са Невелина Кикьова (учебна дейност) и Илиян Рундев (административно-стопанска дейност). Ръководител на ИКТ направление е Антон Веснаков. Целият екип от 37 педагози е описан на страницата „Екип".',
      ],
      href: 'ekip.html',
    },

    // ── ПАРАЛЕЛКИ ──────────────────────────────────────────────────────────
    {
      id: 'classes',
      keywords: ['паралелки', 'класове', 'класен ръководител', 'структура', 'колко класа'],
      answer: [
        'За учебна 2025/2026 г. имаме 14 паралелки — от I до XII клас. Начален: I а, II а, III а/б, IV а/б. Прогимназиален: V а, VI а, VII а. Гимназиален: VIII а до XII а. Класните ръководители са посочени на страницата „Паралелки".',
      ],
      href: 'paralelki.html',
    },

    // ── МАТЕРИАЛНА БАЗА ────────────────────────────────────────────────────
    {
      id: 'infrastructure',
      keywords: ['материална', 'база', 'сграда', 'кабинети', 'компютри', 'лаборатории', 'спортна зала', 'библиотека', 'оборудване'],
      answer: [
        'Разполагаме с 30+ учебни кабинета, 5 компютърни лаборатории, 2 спортни зали и открити игрища. Сградата е модернизирана с дигитализирани класни стаи и специализирани лаборатории по програмиране.',
      ],
      href: 'materialna-baza.html',
    },

    // ── УНИФОРМИ ───────────────────────────────────────────────────────────
    {
      id: 'uniforms',
      keywords: ['униформа', 'униформи', 'блуза', 'суичър', 'худи', 'дрехи', 'цвят', 'зелено', 'магазин', 'размери'],
      answer: [
        'Имаме два варианта: суичър (черен с зелено лого, 80% памук / 20% полиестер) и блуза с къс или дълъг ръкав (зелена, 100% памук). Размери: 128 – 3XL. Носенето е задължително на определени дни. Повече — на страницата „Униформи".',
      ],
      href: 'uniformi.html',
    },

    // ── ПРИЕМ ОБЩО ─────────────────────────────────────────────────────────
    {
      id: 'admissions',
      keywords: ['прием', 'записване', 'кандидатстване', 'как се записва', 'как да запишем'],
      answer: [
        'Приемаме ученици в I клас (деца навършили 7 г.), V клас и VIII клас. За всеки прием има отделни условия, срокове и необходими документи — разгледай страницата „Прием".',
      ],
      href: 'priem.html',
    },

    // ── ПРИЕМ I КЛАС ───────────────────────────────────────────────────────
    {
      id: 'priem1',
      keywords: ['1 клас', 'i клас', 'първи клас', 'малките', '7 годишни', 'начален'],
      answer: [
        'Приемът за I клас е за деца, навършили 7 години. 1-во класиране 2025: заявления до 28 май, резултати на 30 май, записване 2–6 юни. 2-ро класиране: заявления 10–11 юни, записване 13–16 юни. Документи: акт за раждане, здравна карта и декларация.',
        'За I клас записваме всички деца навършили 7 г. Кампанията е май–юни. Информационна среща за родители — всеки четвъртък от 17:00 ч. Документи: акт за раждане, здравна карта, декларация.',
      ],
      href: 'priem-1-klas.html',
    },

    // ── ПРИЕМ V КЛАС ───────────────────────────────────────────────────────
    {
      id: 'priem5',
      keywords: ['5 клас', 'v клас', 'пети клас', 'прогимназиален'],
      answer: [
        'Приемът за V клас е по точкова система: ученици от нашето училище (30 т.), живеещи в района (20 т.), братя/сестри в училището (15 т.) и др. Класирането е в три етапа — юни. Подробности на „Прием в V клас".',
      ],
      href: 'priem-5-klas.html',
    },

    // ── ПРИЕМ VIII КЛАС ────────────────────────────────────────────────────
    {
      id: 'priem8',
      keywords: ['8 клас', 'viii клас', 'осми клас', 'след 7', 'след седми', 'гимназия', 'интелигентни системи', 'програмиране', 'ит'],
      answer: [
        'Приемаме 26 ученици в профил „Интелигентни системи" с разширен английски. 5 години обучение. Балът: удвоена оценка по БЕЛ от НВО + удвоена по математика от НВО + оценка по чужд език + оценка по ИТ от свидетелството.',
        'Профил „Интелигентни системи" — математика, ИТ и програмиране. 26 места. Приемът е чрез НВО след VII клас. Повече на страницата „Прием в VIII клас" и на programisti.com.',
      ],
      href: 'priem-8-klas.html',
    },

    // ── НВО ────────────────────────────────────────────────────────────────
    {
      id: 'nvo',
      keywords: ['нво', 'национално', 'оценяване', 'изпит', '7 клас', 'седми'],
      answer: [
        'НВО се полага в края на VII клас по БЕЛ и математика. Резултатите влизат в бала за VIII клас с двойна тежест. Дати и информация — на страницата „НВО".',
      ],
      href: 'nvo.html',
    },

    // ── ДОКУМЕНТИ ──────────────────────────────────────────────────────────
    {
      id: 'documents',
      keywords: ['документи', 'бланки', 'формуляри', 'декларация', 'какво да нося', 'необходими'],
      answer: [
        'За I клас: акт за раждане, здравна карта, декларация. За VIII клас: резултати от НВО, удостоверение за завършен VII клас и заявление. Всички формуляри за изтегляне — на страниците „Документи за прием" и „Формуляри".',
      ],
      href: 'dokumenti-priem.html',
    },

    // ── КОНТАКТИ ───────────────────────────────────────────────────────────
    {
      id: 'contacts',
      keywords: ['контакт', 'телефон', 'имейл', 'свържа', 'пиша', 'канцелария', 'факс', 'счетоводител'],
      answer: [
        'Директор: 044/66 72 44 · Зам.-директор: 044/66 76 84 · Главен счетоводител: 044/66 74 68 · Имейл: info-2000114@edu.mon.bg · Работно време: пон–пет 07:30–19:00 ч.',
        'Пиши на info-2000114@edu.mon.bg или се обади на 044/66 72 44. Работим пон–пет, 07:30–19:00 ч. Адрес: кв. „Българка", Сливен.',
      ],
      href: 'kontakti.html',
    },

    // ── РАБОТНО ВРЕМЕ ──────────────────────────────────────────────────────
    {
      id: 'hours',
      keywords: ['работно', 'часове', 'кога работи', 'кога е отворено', 'кога мога'],
      answer: [
        'Канцеларията работи всеки работен ден от 07:30 до 19:00 ч.',
      ],
      href: 'kontakti.html',
    },

    // ── ВАКАНЦИИ ───────────────────────────────────────────────────────────
    {
      id: 'holidays',
      keywords: ['ваканция', 'почивни', 'календар', 'коледна', 'есенна', 'пролетна', 'лятна', 'кога почива', 'неучебни'],
      answer: [
        'Учебна 2025/2026: начало — 15.09.2025. Есенна: 31.10–03.11.2025. Коледна: 24.12.2025–04.01.2026. II срок: от 03.02.2026. Неучебен ден: 02.03.2026. Пълният календар е на страницата „Почивни дни и ваканции".',
      ],
      href: 'pochivni-dni.html',
    },

    // ── РАЗПИСАНИЕ ─────────────────────────────────────────────────────────
    {
      id: 'schedule',
      keywords: ['разписание', 'часове', 'програма', 'седмично', 'дневно', 'кога е час'],
      answer: [
        'Дневното и седмичното разписание са в секция „Ученици". Обновяват се при промяна. При въпроси — при класния ръководител.',
      ],
      href: 'dnevno-razpisanie.html',
    },

    // ── СТИПЕНДИИ ──────────────────────────────────────────────────────────
    {
      id: 'scholarships',
      keywords: ['стипендия', 'стипендии', 'финансова', 'помощ', 'отличен успех', 'социална'],
      answer: [
        'Стипендии по ПМС № 33/2013 г. Кандидатстване: I срок — 3–11 октомври; II срок — 25 февруари – 14 март. Има стипендии за отличен успех, социални и др. Формуляр и условия — на страницата „Стипендии".',
      ],
      href: 'stipendii.html',
    },

    // ── ИЗВЪНКЛАСНИ ДЕЙНОСТИ ───────────────────────────────────────────────
    {
      id: 'activities',
      keywords: ['извънкласни', 'секции', 'спорт', 'волейбол', 'баскетбол', 'театър', 'клубове', 'занимания', 'интереси'],
      answer: [
        'Предлагаме: волейбол (пон. и ср. 15:00–17:00, VI–XII клас), баскетбол (пет. 14:30–16:30, V–XII клас), театрални трупи и занимания по интереси. Образованието се случва и извън класната стая!',
      ],
      href: 'izvunklasni-deinosti.html',
    },

    // ── УЧЕНИЧЕСКИ СЪВЕТ ───────────────────────────────────────────────────
    {
      id: 'student_council',
      keywords: ['ученически съвет', 'самоуправление', 'председател', 'инициативи', 'представители'],
      answer: [
        'Ученическият съвет има 17 члена за 2025/2026 г., представляващи над 100 ученици. Всеки клас избира свой представител. Организират инициативи и диалог с ръководството.',
      ],
      href: 'uchenicheski-suvet.html',
    },

    // ── НОВИНИ / ПОСТИЖЕНИЯ ────────────────────────────────────────────────
    {
      id: 'news',
      keywords: ['новини', 'актуално', 'постижения', 'награди', 'конкурс', 'олимпиада', 'национално'],
      answer: [
        'Последно: Даниел Константинов и Венцислав Колев спечелиха второ място в националния конкурс „Аз и изкуственият интелект след 10 години". Ученици се класираха за национален кръг. Всички новини — на страницата „Новини".',
      ],
      href: 'novini.html',
    },

    // ── ПРОЕКТИ ────────────────────────────────────────────────────────────
    {
      id: 'projects',
      keywords: ['проекти', 'европейски', 'еразъм', 'оперативна програма', 'приобщаващо'],
      answer: [
        'Участваме в ОП „Наука и образование за интелигентен растеж" — проект „Подкрепа за приобщаващо образование" (ЕСФ). Разработили сме интерактивен продукт „Числата…". Участваме и в „Еразъм+" за международен обмен.',
      ],
      href: 'proekti.html',
    },

  ];
}

// ── Специални реакции ─────────────────────────────────────────────────────────

const GREETINGS  = ['здравей', 'здравейте', 'добър', 'добро', 'привет', 'хей', 'hi', 'hello', 'ало'];
const THANKS     = ['благодар', 'мерси', 'благо', 'thanks', 'thank', 'супер', 'страхотно', 'перфектно'];
const FAREWELL   = ['довиждане', 'чао', 'па', 'bye', 'ciao', 'до скоро'];

const GREETING_REPLIES = [
  'Здравей! 👋 С какво мога да помогна?',
  'Здравейте! Питай смело.',
  'Привет! Тук съм — казвай.',
];
const THANKS_REPLIES = [
  'Моля! Ако имаш още въпроси, питай.',
  'Няма проблем! За всичко друго — тук съм.',
  'С удоволствие! 😊',
];
const FAREWELL_REPLIES = [
  'Довиждане! Успешен ден! 👋',
  'Чао! Ако имаш въпроси — знаеш къде да ни намериш.',
];
const FALLBACK_REPLIES = [
  'Не намерих точен отговор на това. Обади се на канцеларията: 📞 044/66 72 44 (пон–пет 07:30–19:00).',
  'Хм, за това нямам информация в момента. Най-добре пиши на info-2000114@edu.mon.bg — ще получиш точен отговор.',
  'За по-специфични въпроси е по-добре да се свържеш с нас директно: 📞 044/66 72 44.',
];

// ── Markup ────────────────────────────────────────────────────────────────────

function buildBotMarkup(kb) {
  const wrapper = document.createElement('div');
  wrapper.className = 'faq-bot';

  const chipLabels = {
    about: 'За училището',
    priem1: 'Прием I клас',
    priem8: 'Прием VIII клас',
    contacts: 'Контакти',
    holidays: 'Ваканции',
    activities: 'Извънкласни',
  };

  const chips = Object.entries(chipLabels)
    .map(([id, label]) => `<button class="faq-bot-chip" type="button" data-faq-id="${id}">${label}</button>`)
    .join('');

  wrapper.innerHTML = `
    <button class="faq-bot-toggle" id="faqBotToggle" type="button" aria-expanded="false" aria-controls="faqBotPanel">
      <span class="faq-bot-toggle-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1">
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
          <path d="M8 9h8M8 13h5"/>
        </svg>
      </span>
      <span class="faq-bot-toggle-text">Помощ</span>
    </button>

    <section class="faq-bot-panel" id="faqBotPanel" aria-hidden="true">
      <header class="faq-bot-head">
        <div>
          <div class="faq-bot-eyebrow">СУ „Йордан Йовков"</div>
          <h3>Асистент</h3>
        </div>
        <button class="faq-bot-close" id="faqBotClose" type="button" aria-label="Затвори">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </header>

      <div class="faq-bot-body" id="faqBotBody">
        <article class="faq-msg faq-msg--bot">
          <p>Здравей! Аз съм асистентът на СУ „Йордан Йовков". 👋</p>
          <p>Може да ме питаш за прием, екипа, ваканциите, стипендиите, патрона — или просто „Разкажи ми за училището".</p>
          <div class="faq-bot-chips">${chips}</div>
        </article>
      </div>

      <form class="faq-bot-form" id="faqBotForm">
        <input class="faq-bot-input" id="faqBotInput" type="search" autocomplete="off" placeholder="Напиши въпрос..." aria-label="Въпрос към асистента">
        <button class="faq-bot-send" id="faqBotSend" type="submit" aria-label="Изпрати">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </form>
    </section>
  `;
  return wrapper;
}

// ── Core ──────────────────────────────────────────────────────────────────────

export function initFaqBot() {
  if (document.querySelector('.faq-bot')) return;

  const kb = createKnowledgeBase();
  document.body.appendChild(buildBotMarkup(kb));

  const toggle   = document.getElementById('faqBotToggle');
  const panel    = document.getElementById('faqBotPanel');
  const closeBtn = document.getElementById('faqBotClose');
  const body     = document.getElementById('faqBotBody');
  const form     = document.getElementById('faqBotForm');
  const input    = document.getElementById('faqBotInput');
  const sendBtn  = document.getElementById('faqBotSend');

  if (!toggle || !panel || !closeBtn || !body || !form || !input || !sendBtn) return;

  const scrollBottom = () => { body.scrollTop = body.scrollHeight; };

  const addTyping = () => {
    const el = document.createElement('article');
    el.className = 'faq-msg faq-msg--bot faq-msg--typing';
    el.id = 'faqTyping';
    el.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(el);
    scrollBottom();
  };

  const removeTyping = () => document.getElementById('faqTyping')?.remove();

  const addUserMsg = (text) => {
    const el = document.createElement('article');
    el.className = 'faq-msg faq-msg--user';
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    el.appendChild(paragraph);
    body.appendChild(el);
    scrollBottom();
  };

  const addBotMsg = (html, delay = 650) => new Promise(resolve => {
    addTyping();
    setTimeout(() => {
      removeTyping();
      const el = document.createElement('article');
      el.className = 'faq-msg faq-msg--bot';
      el.innerHTML = html;
      body.appendChild(el);
      scrollBottom();
      resolve();
    }, delay);
  });

  const is = (query, list) => list.some(w => normalizeText(query).includes(normalizeText(w)));

  const findMatch = (query) => {
    const q = normalizeText(query);
    if (!q) return null;
    const exact = kb.find(item => item.keywords.some(k => {
      const nk = normalizeText(k);
      return q.includes(nk) || nk.includes(q);
    }));
    if (exact) return exact;
    if (q.length >= 4) {
      return kb.find(item => item.keywords.some(k => {
        const nk = normalizeText(k);
        return nk.startsWith(q.slice(0, 4)) || q.startsWith(nk.slice(0, 4));
      })) || null;
    }
    return null;
  };

  const handleQuery = async (query) => {
    addUserMsg(query);
    if (is(query, GREETINGS)) { await addBotMsg(`<p>${pick(GREETING_REPLIES)}</p>`, 400); return; }
    if (is(query, THANKS))    { await addBotMsg(`<p>${pick(THANKS_REPLIES)}</p>`, 400);   return; }
    if (is(query, FAREWELL))  { await addBotMsg(`<p>${pick(FAREWELL_REPLIES)}</p>`, 400); return; }

    const match = findMatch(query);
    if (match) {
      await addBotMsg(`<p>${pick(match.answer)}</p><a class="faq-msg-link" href="${match.href}">Виж повече →</a>`, 700);
      return;
    }
    await addBotMsg(`<p>${pick(FALLBACK_REPLIES)}</p>`, 700);
  };

  const setOpen = (open) => {
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    if (open) window.requestAnimationFrame(() => input.focus());
  };

  toggle.addEventListener('click', () => setOpen(panel.getAttribute('aria-hidden') === 'true'));
  closeBtn.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel.classList.contains('open')) setOpen(false);
  });

  body.addEventListener('click', e => {
    const chip = e.target.closest('.faq-bot-chip');
    if (!chip) return;
    const item = kb.find(f => f.id === chip.dataset.faqId);
    if (!item) return;
    addUserMsg(chip.textContent);
    addBotMsg(`<p>${pick(item.answer)}</p><a class="faq-msg-link" href="${item.href}">Виж повече →</a>`, 700);
  });

  const submitQuery = () => {
    const query = input.value.trim();
    if (!query) return false;
    handleQuery(query);
    form.reset();
    return true;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitQuery();
  });

  sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    submitQuery();
  });
}