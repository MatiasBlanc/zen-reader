import {
  createIcons,
  Download,
  Globe,
  ShieldCheck,
  Zap,
  Sparkles,
  BookOpen,
  Clock,
  Check,
  ChevronDown,
  HardDrive,
  Code2,
  Sun,
  Moon,
  Layers,
  Star,
  ExternalLink,
  Laptop,
  Palette
} from 'lucide';

export function refreshIcons() {
  createIcons({
    icons: {
      Download,
      Globe,
      ShieldCheck,
      Zap,
      Sparkles,
      BookOpen,
      Clock,
      Check,
      ChevronDown,
      HardDrive,
      Code2,
      Sun,
      Moon,
      Layers,
      Star,
      ExternalLink,
      Laptop,
      Palette
    }
  });
}

// Language & i18n Management
export type Language = 'en' | 'es';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // announcement
    'announcement.text': '<strong>Pocket shut down. Omnivore shut down.</strong> Zen Reader is forever: 100% local, zero servers, zero subscriptions.',
    'announcement.link': 'See comparison →',

    // nav
    'nav.philosophy': 'Philosophy',
    'nav.simulator': 'Simulator',
    'nav.comparison': 'Comparison',
    'nav.installation': 'Installation',
    'nav.faq': 'FAQ',

    // themes
    'theme.paper': 'Paper',
    'theme.sepia': 'Sepia',
    'theme.dark': 'Night',

    // hero
    'hero.title': 'Read without noise.<br/><span class="italic text-zen-accent font-normal">Save with a single click.</span>',
    'hero.subtitle': 'The minimalist <em>read-it-later</em> sanctuary that respects your attention. Save articles to read offline without ads, cookie banners, or telemetry. <strong>100% local in your browser</strong>, zero accounts, and zero cloud servers.',
    'hero.cta.firefox': 'Install for Firefox / Zen Browser',
    'hero.cta.chrome': 'For Chrome & Edge',
    'hero.stat1.val': '0 KB',
    'hero.stat1.desc': 'On external servers. Zero cloud.',
    'hero.stat2.val': '100%',
    'hero.stat2.desc': 'Local-first (Secure IndexedDB).',
    'hero.stat3.val': '0',
    'hero.stat3.desc': 'Accounts, logins, or emails requested.',
    'hero.stat4.val': '< 50ms',
    'hero.stat4.desc': 'Instant save. Zero RAM impact.',

    // simulator
    'sim.title': 'The Cluttered Web vs. Your Zen Sanctuary',
    'sim.tab.chaos': '🚫 Typical Web (Noisy)',
    'sim.tab.zen': '✨ Zen Reader (Pure)',
    'sim.btn.clean': 'Clean',
    'sim.cookie.text': '🍪 We use 48 trackers and cookies to monitor your clicks and serve targeted ads.',
    'sim.cookie.btn1': 'Customize (24 clicks)',
    'sim.cookie.btn2': 'Accept all',
    'sim.popup.title': '🚨 WAIT! BEFORE READING: SUBSCRIBE TO OUR DAILY NEWSLETTER (TODAY ONLY!)',
    'sim.popup.btn': 'Subscribe',
    'sim.chaos.tag': 'Productivity • 8 min read • Sponsored',
    'sim.chaos.headline': 'The Art of Deep Focus in the Age of Digital Saturation',
    'sim.chaos.ad': 'Want to lose 10 pounds while sleeping? Dentists hate this trick',
    'sim.chaos.p1': 'In a hyper-connected world, maintaining concentration for more than fifteen minutes feels like an unattainable miracle. Relentless notifications, addictive recommendation algorithms, and omnipresent visual noise...',
    'sim.chaos.p2': 'Fragment our thinking in invisible yet devastating ways. To reclaim intellectual clarity, we must shed the constant urge for continuous stimulation.',
    'sim.chaos.sidebar.title': 'Viral Articles',
    'sim.chaos.sidebar.item1': '10 celebrities you won\'t believe today',
    'sim.chaos.sidebar.item2': 'Invest $200 and earn millions',
    'sim.chaos.sidebar.item3': 'This secret gadget is selling out fast',
    'sim.chaos.sidebar.app.title': 'DOWNLOAD OUR APP',
    'sim.chaos.sidebar.app.sub': 'To continue reading this article',
    'sim.zen.readtime': '4 min read',
    'sim.zen.saved': 'Saved today',
    'sim.zen.offline': 'Offline',
    'sim.zen.typography': 'Typography:',
    'sim.zen.title': 'The Art of Deep Focus in the Age of Digital Saturation',
    'sim.zen.author': 'By Deep Thought • Original source preserved locally',
    'sim.zen.p1': 'In a hyper-connected world, maintaining concentration for more than fifteen minutes feels like an unattainable miracle. Relentless notifications, addictive recommendation algorithms designed to hijack dopamine, and omnipresent visual noise fragment our thinking in subtle yet devastating ways.',
    'sim.zen.quote': '"Simplicity is not the lack of clutter, that\'s a consequence of simplicity. Simplicity somehow essentially describes the purpose and place of an object and what it does."',
    'sim.zen.p2': 'To reclaim intellectual clarity, we must shed the urge for continuous stimulation. Reading without ads, without screen-blocking cookie popups, and without blinking banners is not an aesthetic luxury: it is an indispensable act of mental hygiene for deep understanding.',
    'sim.zen.footer': 'Article saved in your browser\'s local storage (IndexedDB)',

    // philosophy
    'phil.title': 'Built to last.<br/>Designed for calm.',
    'phil.subtitle': 'After the shutdowns of Pocket and Omnivore, we built a tool that can never be discontinued: an autonomous extension living inside your browser, with zero hidden costs or servers to maintain.',
    'phil.p1.title': '100% Local & Offline',
    'phil.p1.desc': 'Your articles are stored in <strong>native IndexedDB</strong> with unlimited storage. Never depend on external servers that might go bankrupt or lose your reading list.',
    'phil.p1.tag': 'IndexedDB • Zero Cloud',
    'phil.p2.title': 'Privacy by Design',
    'phil.p2.desc': 'What you read never leaves your computer. <strong>Zero telemetry, zero third-party analytics</strong>, zero cookies, and zero selling of your reading habits.',
    'phil.p2.tag': 'Zero Telemetry • 100% Private',
    'phil.p3.title': 'Pure Readability Engine',
    'phil.p3.desc': 'Powered by Mozilla Readability to parse clean articles, preserving typography, key images, and structure while removing 100% of clutter and ad scripts.',
    'phil.p3.tag': 'Mozilla Readability • DOMPurify',
    'phil.p4.title': 'Instant Clipper',
    'phil.p4.desc': 'Press <kbd class="px-2 py-0.5 bg-zen-subtle border border-zen rounded font-mono text-xs font-bold text-zen-primary">Alt + Shift + S</kbd> or click the icon. Saved in the background in under 50ms with a non-intrusive toast.',
    'phil.p4.tag': 'Custom Shortcut • Zero Latency',
    'phil.p5.title': 'Designed for Zen Browser',
    'phil.p5.desc': 'Inspired by the aesthetics and philosophy of <strong>Zen Browser</strong>. Native compatibility with Firefox, Chrome, Brave, Arc, and Microsoft Edge under Manifest V3.',
    'phil.p5.tag': 'Zen Browser • Firefox • Chromium',
    'phil.p6.title': 'Clean Architecture & MIT',
    'phil.p6.desc': 'Clean 4-tier decoupled architecture, verified with <code>dependency-cruiser</code> in CI. Transparent, 100% auditable open source code.',
    'phil.p6.tag': 'MIT License • Clean Architecture',

    // comparison
    'comp.badge': 'Comparative Analysis',
    'comp.title': 'Why Zen Reader over other alternatives?',
    'comp.col.criteria': 'Criteria',
    'comp.col.zen': 'Zen Reader',
    'comp.col.pocket': 'Pocket (RIP 2025)',
    'comp.col.omnivore': 'Omnivore (RIP 2024)',
    'comp.col.readwise': 'Readwise Reader',
    'comp.col.wallabag': 'Wallabag',
    'comp.r1.label': 'Monthly Price',
    'comp.r1.zen': '100% Free (MIT)',
    'comp.r1.pocket': 'Shut down ($5/mo)',
    'comp.r1.omnivore': 'Shut down',
    'comp.r1.readwise': '$12 / month',
    'comp.r1.wallabag': 'Free (Self-host)',
    'comp.r2.label': 'Account Required',
    'comp.r2.zen': 'No (Zero signups)',
    'comp.r2.pocket': 'Yes (Firefox/Google)',
    'comp.r2.omnivore': 'Yes (Email)',
    'comp.r2.readwise': 'Yes (Readwise account)',
    'comp.r2.wallabag': 'Yes (Own server)',
    'comp.r3.label': 'Cloud Server Dependency',
    'comp.r3.zen': 'None (100% Local)',
    'comp.r3.pocket': 'Central servers',
    'comp.r3.omnivore': 'Central servers',
    'comp.r3.readwise': 'Central servers',
    'comp.r3.wallabag': 'VPS Required',
    'comp.r4.label': '100% Offline Reading',
    'comp.r4.zen': 'Yes (IndexedDB)',
    'comp.r4.pocket': 'Partial',
    'comp.r4.omnivore': 'Partial',
    'comp.r4.readwise': 'PWA Cache',
    'comp.r4.wallabag': 'App dependent',
    'comp.r5.label': 'Open Source (MIT)',
    'comp.r5.zen': 'Yes (MIT License)',
    'comp.r5.pocket': 'Closed proprietary',
    'comp.r5.omnivore': 'AGPL-3.0 (Closed)',
    'comp.r5.readwise': 'Closed proprietary',
    'comp.r5.wallabag': 'MIT',
    'comp.r6.label': 'Setup Time',
    'comp.r6.zen': '10 seconds (Install & read)',
    'comp.r6.pocket': 'Shut down',
    'comp.r6.omnivore': 'Shut down',
    'comp.r6.readwise': 'Card setup',
    'comp.r6.wallabag': 'Complex (Docker/SQL)',
    'comp.callout.text': 'Why pay $12/mo or manage Docker servers when you just want to save articles and read in peace?',
    'comp.callout.link': 'Get started with Zen Reader →',

    // installation
    'inst.title': 'Start reading in peace today',
    'inst.subtitle': 'Install the extension in your favorite browser in less than a minute.',
    'inst.firefox.badge': 'Recommended',
    'inst.firefox.ver': 'v2.0.0 • Manifest V3',
    'inst.firefox.title': 'Zen Browser & Firefox',
    'inst.firefox.desc': 'Designed to blend seamlessly with Zen Browser and Firefox. Zero RAM impact, full privacy, and instant offline access.',
    'inst.firefox.btn': 'Install from Firefox Add-ons',
    'inst.firefox.helper': 'Official Mozilla Add-ons Store (AMO)',
    'inst.chrome.badge': 'Chromium',
    'inst.chrome.ver': 'v2.0.0 • Manifest V3',
    'inst.chrome.title': 'Chrome, Brave, Edge & Arc',
    'inst.chrome.desc': 'Compatible with all Chromium-based browsers. Lightweight service worker and smooth background article capture.',
    'inst.chrome.btn': 'Download Chromium Package (.zip)',
    'inst.chrome.helper': 'In chrome://extensions → Developer mode → Load unpacked',
    'inst.dev.title': 'Looking for the source code or want to build locally?',
    'inst.dev.badge': 'Open Source (MIT)',
    'inst.dev.desc': 'Zen Reader is 100% open source under the MIT license. You can clone the repository, inspect the code, or contribute directly on GitHub.',
    'inst.dev.btn': 'View & Clone on GitHub →',
    'inst.dev.sub': 'npm install • npm run build',

    // faq
    'faq.title': 'Everything you need to know',
    'faq.subtitle': 'Complete clarity, no fine print or hidden surprises.',
    'faq.q1': 'What motivated the creation of Zen Reader after Pocket and Omnivore shut down?',
    'faq.a1': 'Pocket announced its end in July 2025 after years of neglect. Omnivore closed its servers in November 2024 after an acquisition. The market was left dominated by $10–$15/mo subscriptions or tools requiring complex self-hosted servers. Zen Reader takes the opposite approach: zero servers, installs in 10 seconds, and guaranteed to work forever because it runs 100% locally on your machine.',
    'faq.q2': 'Where are my articles stored and how is my privacy protected?',
    'faq.a2': 'Your articles are stored locally in your browser\'s <strong>IndexedDB</strong> database. No data ever travels to external servers: there is no backend, no telemetry, no analytics, and no URL tracking. Your reading history is strictly yours and stays on your disk.',
    'faq.q3': 'Does it truly work offline when I have no internet connection?',
    'faq.a3': 'Yes, completely. When saving an article, Zen Reader extracts the text, headings, and key images, sanitizes them, and persists them locally. You can open Zen Reader on an airplane or mountain cabin with zero internet and read your entire library smoothly.',
    'faq.q4': 'Which browsers are supported and why focus on Zen Browser?',
    'faq.a4': 'Zen Reader is built on universal Manifest V3 standards. It is compatible with <strong>Zen Browser, Mozilla Firefox, Google Chrome, Brave, Microsoft Edge, and Arc</strong>. We share Zen Browser\'s vision of a calm, aesthetic, and privacy-focused web experience.',
    'faq.q5': 'Is there any limit on how many articles I can save?',
    'faq.a5': 'The extension requests the native <code>unlimitedStorage</code> permission, meaning the only limit is the available storage on your hard drive. You can save thousands of articles with zero fees or artificial limits.',
    'faq.q6': 'How is the project architected technically?',
    'faq.a6': 'Zen Reader follows <strong>Clean Architecture</strong> with 4 decoupled layers (Domain, Application, Infrastructure, Presentation). The frontend is built with Preact and Tailwind CSS, bundled with Vite, and architecture rules are enforced in CI via <code>dependency-cruiser</code>.',

    // manifesto / cta
    'cta.title': 'Reclaim peace when reading the web.',
    'cta.subtitle': 'No accounts. No servers. No ads. Just you and the ideas that matter.',
    'cta.btn.install': 'Install Zen Reader Free',
    'cta.btn.github': 'Explore Code on GitHub',

    // footer
    'footer.madein': 'Crafted with serenity by <a href="https://madeinchile.tech" target="_blank" rel="noopener noreferrer" class="font-semibold text-zen-primary hover:text-zen-accent transition-colors underline underline-offset-2">Made in Chile</a>',
    'footer.mit': 'MIT License',
    'footer.privacy': 'Privacy',
    'footer.changelog': 'Changelog',
  },
  es: {
    // announcement
    'announcement.text': '<strong>Pocket cerró. Omnivore cerró.</strong> Zen Reader es para siempre: 100% local, sin servidores y sin suscripciones.',
    'announcement.link': 'Ver comparativa →',

    // nav
    'nav.philosophy': 'Filosofía',
    'nav.simulator': 'Simulador',
    'nav.comparison': 'Comparativa',
    'nav.installation': 'Instalación',
    'nav.faq': 'FAQ',

    // themes
    'theme.paper': 'Papel',
    'theme.sepia': 'Sepia',
    'theme.dark': 'Noche',

    // hero
    'hero.title': 'Lee sin ruido.<br/><span class="italic text-zen-accent font-normal">Guarda con un solo clic.</span>',
    'hero.subtitle': 'El santuario <em>read-it-later</em> minimalista que respeta tu mente. Guarda artículos para leer después sin anuncios, muros de cookies ni telemetría. <strong>100% local en tu navegador</strong>, sin cuentas y sin servidores en la nube.',
    'hero.cta.firefox': 'Instalar para Firefox / Zen Browser',
    'hero.cta.chrome': 'Para Chrome & Edge',
    'hero.stat1.val': '0 KB',
    'hero.stat1.desc': 'En servidores externos. Cero nube.',
    'hero.stat2.val': '100%',
    'hero.stat2.desc': 'Local First (IndexedDB seguro).',
    'hero.stat3.val': '0',
    'hero.stat3.desc': 'Cuentas, logins ni correos pedidos.',
    'hero.stat4.val': '< 50ms',
    'hero.stat4.desc': 'Carga instantánea. Cero impacto RAM.',

    // simulator
    'sim.title': 'La web saturada vs. Tu santuario Zen',
    'sim.tab.chaos': '🚫 Web Típica (Ruidosa)',
    'sim.tab.zen': '✨ Zen Reader (Puro)',
    'sim.btn.clean': 'Limpiar',
    'sim.cookie.text': '🍪 Usamos 48 rastreadores y cookies para medir cada uno de tus clics y vender publicidad personalizada.',
    'sim.cookie.btn1': 'Configurar (24 clics)',
    'sim.cookie.btn2': 'Aceptar todo',
    'sim.popup.title': '🚨 ¡ESPERA! ANTES DE LEER: SUSCRÍBETE A NUESTRA NEWSLETTER DIARIA (¡SÓLO HOY!)',
    'sim.popup.btn': 'Suscribirme',
    'sim.chaos.tag': 'Productividad • 8 min de lectura • Patrocinado',
    'sim.chaos.headline': 'El arte del enfoque profundo en la era de la saturación digital',
    'sim.chaos.ad': '¿Quieres perder 10 kilos durmiendo? Los dentistas odian este truco',
    'sim.chaos.p1': 'En un mundo hiperconectado, mantener la concentración durante más de quince minutos parece un milagro casi inalcanzable. Las notificaciones incesantes, los algoritmos de recomendación adictivos y el ruido visual omnipresente...',
    'sim.chaos.p2': 'Fragmentan nuestro pensamiento de formas invisibles pero devastadoras. Para recuperar la lucidez intelectual es imperativo despojarnos de la necesidad de estímulo continuo.',
    'sim.chaos.sidebar.title': 'Artículos Virales',
    'sim.chaos.sidebar.item1': '10 celebridades que no creerás cómo lucen hoy',
    'sim.chaos.sidebar.item2': 'Invierte $200 y gana millones según expertos',
    'sim.chaos.sidebar.item3': 'Este gadget secreto está agotándose en tu ciudad',
    'sim.chaos.sidebar.app.title': 'DESCARGA NUESTRA APP',
    'sim.chaos.sidebar.app.sub': 'Para continuar leyendo este artículo',
    'sim.zen.readtime': '4 min de lectura',
    'sim.zen.saved': 'Guardado hoy',
    'sim.zen.offline': 'Offline',
    'sim.zen.typography': 'Tipografía:',
    'sim.zen.title': 'El arte del enfoque profundo en la era de la saturación digital',
    'sim.zen.author': 'Por Pensamiento Profundo • Fuente original preservada localmente',
    'sim.zen.p1': 'En un mundo hiperconectado, mantener la concentración durante más de quince minutos parece un milagro casi inalcanzable. Las notificaciones incesantes, los algoritmos de recomendación diseñados para secuestrar la dopamina y el ruido visual omnipresente fragmentan nuestro pensamiento de formas sutiles pero devastadoras.',
    'sim.zen.quote': '"La simplicidad no es la falta de elementos, sino la presencia de la calma absoluta y el propósito sin distracciones."',
    'sim.zen.p2': 'Para recuperar la lucidez intelectual, es imperativo despojarnos de la necesidad de estimulación continua. Leer sin anuncios, sin popups de cookies que bloquean la pantalla y sin banners parpadeantes no es un lujo estético: es un acto de higiene mental indispensable para comprender en profundidad.',
    'sim.zen.footer': 'Artículo guardado en el almacenamiento local de tu navegador (IndexedDB)',

    // philosophy
    'phil.title': 'Construido para durar.<br/>Diseñado para la calma.',
    'phil.subtitle': 'Tras el cierre sucesivo de servicios como Pocket y Omnivore, decidimos crear una herramienta que no pueda desaparecer jamás: una extensión autónoma que vive en tu navegador, sin costes ocultos ni servidores que mantener.',
    'phil.p1.title': '100% Local y Offline',
    'phil.p1.desc': 'Tus artículos se persisten en <strong>IndexedDB nativo</strong> con almacenamiento ilimitado. No dependes de servidores externos que puedan quebrar o perder tus lecturas.',
    'phil.p1.tag': 'IndexedDB • Sin Cloud',
    'phil.p2.title': 'Privacidad por Diseño',
    'phil.p2.desc': 'El contenido de lo que lees nunca sale de tu equipo. <strong>Cero telemetría, cero analítica de terceros</strong>, cero cookies y cero venta de patrones de lectura.',
    'phil.p2.tag': 'Zero Telemetry • 100% Privado',
    'phil.p3.title': 'Motor Readability Puro',
    'phil.p3.desc': 'Usa el motor de Mozilla Readability para diseccionar artículos, preservando tipografía limpia, imágenes clave y subtítulos, mientras expulsa el 100% de la basura publicitaria.',
    'phil.p3.tag': 'Mozilla Readability • DOMPurify',
    'phil.p4.title': 'Clipper Instantáneo',
    'phil.p4.desc': 'Presiona <kbd class="px-2 py-0.5 bg-zen-subtle border border-zen rounded font-mono text-xs font-bold text-zen-primary">Alt + Shift + S</kbd> o pulsa el icono. Guardado en segundo plano en menos de 50 milisegundos con notificación no invasiva.',
    'phil.p4.tag': 'Atajo configurable • Cero latencia',
    'phil.p5.title': 'Diseñado para Zen Browser',
    'phil.p5.desc': 'Inspirado en la filosofía y estética de <strong>Zen Browser</strong>. Compatible de forma nativa con Firefox, Chrome, Brave, Arc y Microsoft Edge bajo Manifest V3.',
    'phil.p5.tag': 'Zen Browser • Firefox • Chromium',
    'phil.p6.title': 'Clean Architecture & MIT',
    'phil.p6.desc': 'Arquitectura limpia de 4 capas desacopladas, verificada con <code>dependency-cruiser</code> en CI. Sin sorpresas, código 100% auditable y libre para siempre.',
    'phil.p6.tag': 'Licencia MIT • Clean Architecture',

    // comparison
    'comp.badge': 'Análisis Comparativo',
    'comp.title': '¿Por qué Zen Reader frente a otras alternativas?',
    'comp.col.criteria': 'Criterio',
    'comp.col.zen': 'Zen Reader',
    'comp.col.pocket': 'Pocket (RIP 2025)',
    'comp.col.omnivore': 'Omnivore (RIP 2024)',
    'comp.col.readwise': 'Readwise Reader',
    'comp.col.wallabag': 'Wallabag',
    'comp.r1.label': 'Precio mensual',
    'comp.r1.zen': '100% Gratis (MIT)',
    'comp.r1.pocket': 'Cerrado ($5/mes)',
    'comp.r1.omnivore': 'Cerrado',
    'comp.r1.readwise': '~$12 / mes',
    'comp.r1.wallabag': 'Gratis (Self-host)',
    'comp.r2.label': 'Cuenta obligatoria',
    'comp.r2.zen': 'No (0 registros)',
    'comp.r2.pocket': 'Sí (Firefox/Google)',
    'comp.r2.omnivore': 'Sí (Email)',
    'comp.r2.readwise': 'Sí (Cuenta Readwise)',
    'comp.r2.wallabag': 'Sí (Servidor propio)',
    'comp.r3.label': 'Dependencia de Servidor Cloud',
    'comp.r3.zen': 'Ninguna (100% Local)',
    'comp.r3.pocket': 'Servidores centrales',
    'comp.r3.omnivore': 'Servidores centrales',
    'comp.r3.readwise': 'Servidores centrales',
    'comp.r3.wallabag': 'Requiere tu VPS',
    'comp.r4.label': 'Lectura 100% Offline',
    'comp.r4.zen': 'Sí (IndexedDB)',
    'comp.r4.pocket': 'Parcial',
    'comp.r4.omnivore': 'Parcial',
    'comp.r4.readwise': 'Cache PWA',
    'comp.r4.wallabag': 'Depende de apps',
    'comp.r5.label': 'Código Abierto (Open Source)',
    'comp.r5.zen': 'Sí (Licencia MIT)',
    'comp.r5.pocket': 'Propietario cerrado',
    'comp.r5.omnivore': 'AGPL-3.0 (Cerró)',
    'comp.r5.readwise': 'Propietario cerrado',
    'comp.r5.wallabag': 'MIT',
    'comp.r6.label': 'Facilidad de puesta en marcha',
    'comp.r6.zen': '10 segundos (Instalar y leer)',
    'comp.r6.pocket': 'Cerrado',
    'comp.r6.omnivore': 'Cerrado',
    'comp.r6.readwise': 'Rápida con tarjeta',
    'comp.r6.wallabag': 'Compleja (Docker/SQL)',
    'comp.callout.text': '¿Por qué pagar $12/mes o administrar servidores Docker si solo quieres guardar artículos y leerlos en paz?',
    'comp.callout.link': 'Empieza con Zen Reader →',

    // installation
    'inst.title': 'Comienza a leer en paz hoy',
    'inst.subtitle': 'Instala la extensión en tu navegador favorito en menos de un minuto.',
    'inst.firefox.badge': 'Recomendado',
    'inst.firefox.ver': 'v2.0.0 • Manifest V3',
    'inst.firefox.title': 'Zen Browser & Firefox',
    'inst.firefox.desc': 'Diseñado para integrarse armónicamente con la interfaz de Zen Browser y Firefox. Cero impacto de memoria y soporte offline total.',
    'inst.firefox.btn': 'Instalar desde Firefox Add-ons',
    'inst.firefox.helper': 'Tienda oficial de complementos de Mozilla (AMO)',
    'inst.chrome.badge': 'Chromium',
    'inst.chrome.ver': 'v2.0.0 • Manifest V3',
    'inst.chrome.title': 'Chrome, Brave, Edge & Arc',
    'inst.chrome.desc': 'Compatible con todos los navegadores basados en Chromium. Service Worker ultraligero y captura fluida de artículos.',
    'inst.chrome.btn': 'Descargar paquete Chromium (.zip)',
    'inst.chrome.helper': 'En chrome://extensions → Modo desarrollador → Cargar descomprimida',
    'inst.dev.title': '¿Prefieres ver el código fuente o compilar localmente?',
    'inst.dev.badge': 'Open Source (MIT)',
    'inst.dev.desc': 'Zen Reader es 100% código abierto bajo licencia MIT. Puedes clonar el repositorio, auditar el código o contribuir en GitHub.',
    'inst.dev.btn': 'Ver y clonar en GitHub →',
    'inst.dev.sub': 'npm install • npm run build',

    // faq
    'faq.title': 'Todo lo que necesitas saber',
    'faq.subtitle': 'Claridad absoluta, sin letra pequeña ni sorpresas técnicas.',
    'faq.q1': '¿Qué motivó la creación de Zen Reader tras el cierre de Pocket y Omnivore?',
    'faq.a1': 'Pocket anunció su cierre definitivo en julio de 2025 tras años de abandono. Omnivore cerró sus servidores en noviembre de 2024 tras ser adquirido. El mercado quedó dominado por herramientas de suscripción recurrente de $10-$15/mes o plataformas que exigen auto-hospedar servidores complejos. Zen Reader apuesta por el extremo opuesto: una herramienta que no depende de ningún servidor, instalable en 10 segundos y garantizada para durar para siempre porque corre 100% en tu máquina.',
    'faq.q2': '¿Dónde se guardan mis artículos y cómo se protege mi privacidad?',
    'faq.a2': 'Tus artículos se guardan de forma local e íntegra en la base de datos <strong>IndexedDB</strong> de tu propio navegador. Ningún dato viaja a servidores externos: no hay backend, no hay telemetría, no hay analíticas ni rastreo de URLs. Tu historial de lectura es exclusivamente tuyo y permanece en tu disco.',
    'faq.q3': '¿Funciona verdaderamente offline cuando no tengo conexión a internet?',
    'faq.a3': 'Sí, totalmente. Al momento de guardar un artículo con el clipper, Zen Reader extrae el texto, títulos, subtítulos e imágenes principales, los sanitiza y los almacena localmente. Puedes abrir el dashboard de Zen Reader en un avión o en un refugio de montaña sin internet y leer tu biblioteca sin problema.',
    'faq.q4': '¿Qué navegadores son compatibles y por qué se destaca Zen Browser?',
    'faq.a4': 'Zen Reader está construido sobre los estándares universales de Manifest V3. Es compatible con <strong>Zen Browser, Mozilla Firefox, Google Chrome, Brave, Microsoft Edge y Arc</strong>. Compartimos la visión de Zen Browser de una web calmada, estética y centrada en la privacidad del usuario.',
    'faq.q5': '¿Hay algún límite en la cantidad de artículos que puedo guardar?',
    'faq.a5': 'La extensión solicita el permiso nativo <code>unlimitedStorage</code>, lo que significa que el límite de almacenamiento es únicamente el espacio libre disponible en tu disco duro. Puedes guardar miles de artículos sin pagar ningún plan ni preocuparte por cuotas artificiales.',
    'faq.q6': '¿Cómo está construido técnicamente el proyecto?',
    'faq.a6': 'Zen Reader sigue los principios de <strong>Clean Architecture</strong> con cuatro capas estrictas (Dominio, Aplicación, Infraestructura y Presentación). El frontend utiliza Preact y Tailwind CSS, el empaquetador es Vite, y la arquitectura se verifica en cada commit de CI mediante <code>dependency-cruiser</code> para evitar acoplamientos indeseados.',

    // manifesto / cta
    'cta.title': 'Recupera la paz al leer en la web.',
    'cta.subtitle': 'Sin cuentas. Sin servidores. Sin publicidad. Solo tú y las ideas que importan.',
    'cta.btn.install': 'Instalar Zen Reader Gratis',
    'cta.btn.github': 'Explorar Código en GitHub',

    // footer
    'footer.madein': 'Creado con serenidad por <a href="https://madeinchile.tech" target="_blank" rel="noopener noreferrer" class="font-semibold text-zen-primary hover:text-zen-accent transition-colors underline underline-offset-2">Made in Chile</a>',
    'footer.mit': 'Licencia MIT',
    'footer.privacy': 'Privacidad',
    'footer.changelog': 'Changelog',
  }
};

function getInitialLanguage(): Language {
  const saved = localStorage.getItem('zen_landing_lang') as Language | null;
  if (saved && (saved === 'en' || saved === 'es')) {
    return saved;
  }
  // Default to English as requested
  return 'en';
}

function setLanguage(lang: Language) {
  const html = document.documentElement;
  html.lang = lang;
  localStorage.setItem('zen_landing_lang', lang);

  // Update text content
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (key && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Update HTML content
  document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (key && translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });

  // Update Language buttons
  document.querySelectorAll<HTMLButtonElement>('[data-lang-btn]').forEach(btn => {
    const isCurrent = btn.dataset.langBtn === lang;
    btn.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
    if (isCurrent) {
      btn.classList.add('bg-zen-surface', 'font-bold', 'text-zen-primary', 'zen-shadow');
      btn.classList.remove('text-zen-secondary');
    } else {
      btn.classList.remove('bg-zen-surface', 'font-bold', 'text-zen-primary', 'zen-shadow');
      btn.classList.add('text-zen-secondary');
    }
  });
}

// Theme Management
type Theme = 'paper' | 'sepia' | 'dark';

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('zen_landing_theme') as Theme | null;
  if (saved && (saved === 'paper' || saved === 'sepia' || saved === 'dark')) {
    return saved;
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'paper';
}

function setTheme(theme: Theme) {
  const html = document.documentElement;
  html.classList.remove('sepia', 'dark');
  if (theme === 'dark') html.classList.add('dark');
  if (theme === 'sepia') html.classList.add('sepia');
  localStorage.setItem('zen_landing_theme', theme);

  // Update theme buttons
  document.querySelectorAll<HTMLButtonElement>('[data-theme-btn]').forEach(btn => {
    const isCurrent = btn.dataset.themeBtn === theme;
    btn.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
    if (isCurrent) {
      btn.classList.add('bg-zen-surface', 'font-bold', 'text-zen-primary', 'zen-shadow');
      btn.classList.remove('text-zen-secondary');
    } else {
      btn.classList.remove('bg-zen-surface', 'font-bold', 'text-zen-primary', 'zen-shadow');
      btn.classList.add('text-zen-secondary');
    }
  });

  // Update mobile FAB label if present
  const mobileLabel = document.getElementById('mobile-theme-label');
  if (mobileLabel) {
    mobileLabel.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
  }
}

// Mobile Theme Menu Setup
function setupMobileTheme() {
  const fab = document.getElementById('mobile-theme-fab');
  const menu = document.getElementById('mobile-theme-menu');
  if (!fab || !menu) return;

  fab.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target as Node) && !fab.contains(e.target as Node)) {
      menu.classList.add('hidden');
    }
  });

  menu.querySelectorAll<HTMLButtonElement>('[data-theme-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });
}

// Global Reading Progress Indicator
function setupReadingProgress() {
  const progressBar = document.getElementById('global-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
  }, { passive: true });
}

// Interactive Zen Simulator
function setupZenSimulator() {
  const simContainer = document.getElementById('zen-simulator');
  const btnToggleChaos = document.getElementById('sim-btn-chaos');
  const btnToggleZen = document.getElementById('sim-btn-zen');
  const viewChaos = document.getElementById('sim-view-chaos');
  const viewZen = document.getElementById('sim-view-zen');
  const actionCleanWeb = document.getElementById('sim-action-clean');
  const fontSizeDisplay = document.getElementById('sim-font-size');
  const btnFontIncrease = document.getElementById('sim-font-plus');
  const btnFontDecrease = document.getElementById('sim-font-minus');
  const zenContent = document.getElementById('sim-zen-content');

  if (!simContainer || !viewChaos || !viewZen) return;

  let fontMultiplier = 1.0;

  function renderView(view: 'chaos' | 'zen') {
    if (view === 'zen') {
      viewChaos?.classList.add('hidden');
      viewZen?.classList.remove('hidden');
      btnToggleZen?.setAttribute('aria-selected', 'true');
      btnToggleChaos?.setAttribute('aria-selected', 'false');
      btnToggleZen?.classList.add('bg-zen-surface', 'font-semibold', 'zen-shadow');
      btnToggleZen?.classList.remove('text-zen-muted');
      btnToggleChaos?.classList.remove('bg-zen-surface', 'font-semibold', 'zen-shadow');
      btnToggleChaos?.classList.add('text-zen-muted');
    } else {
      viewChaos?.classList.remove('hidden');
      viewZen?.classList.add('hidden');
      btnToggleChaos?.setAttribute('aria-selected', 'true');
      btnToggleZen?.setAttribute('aria-selected', 'false');
      btnToggleChaos?.classList.add('bg-zen-surface', 'font-semibold', 'zen-shadow');
      btnToggleChaos?.classList.remove('text-zen-muted');
      btnToggleZen?.classList.remove('bg-zen-surface', 'font-semibold', 'zen-shadow');
      btnToggleZen?.classList.add('text-zen-muted');
    }
  }

  btnToggleChaos?.addEventListener('click', () => renderView('chaos'));
  btnToggleZen?.addEventListener('click', () => renderView('zen'));
  actionCleanWeb?.addEventListener('click', () => renderView('zen'));

  btnFontIncrease?.addEventListener('click', () => {
    if (fontMultiplier < 1.4) {
      fontMultiplier += 0.1;
      if (zenContent) zenContent.style.fontSize = `${fontMultiplier * 1.05}rem`;
      if (fontSizeDisplay) fontSizeDisplay.textContent = `${Math.round(fontMultiplier * 100)}%`;
    }
  });

  btnFontDecrease?.addEventListener('click', () => {
    if (fontMultiplier > 0.8) {
      fontMultiplier -= 0.1;
      if (zenContent) zenContent.style.fontSize = `${fontMultiplier * 1.05}rem`;
      if (fontSizeDisplay) fontSizeDisplay.textContent = `${Math.round(fontMultiplier * 100)}%`;
    }
  });
}

// Copy to Clipboard Utility
function setupCopyButtons() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy') || '';
      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = btn.innerHTML;
        btn.innerHTML = `<svg class="w-4 h-4 text-emerald-600 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied!`;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    });
  });
}

// FAQ Accordion
function setupFaq() {
  const items = document.querySelectorAll<HTMLDetailsElement>('.faq-item');
  items.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        items.forEach(other => {
          if (other !== item && other.open) {
            other.open = false;
          }
        });
      }
    });
  });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  const initialLang = getInitialLanguage();
  setLanguage(initialLang);

  document.querySelectorAll<HTMLButtonElement>('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.langBtn as Language;
      if (lang) {
        setLanguage(lang);
        refreshIcons();
      }
    });
  });

  const currentTheme = getInitialTheme();
  setTheme(currentTheme);

  document.querySelectorAll<HTMLButtonElement>('[data-theme-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.themeBtn as Theme;
      if (theme) setTheme(theme);
    });
  });

  setupReadingProgress();
  setupZenSimulator();
  setupCopyButtons();
  setupFaq();
  setupMobileTheme();
  refreshIcons();
});

