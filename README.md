# Zen Reader

<div align="center">

[![Firefox Add-ons](https://img.shields.io/badge/Firefox_Add--ons-Install_Zen_Reader-orange?logo=firefox-browser&style=for-the-badge)](https://addons.mozilla.org/es-ES/firefox/addon/zenreader/)
[![Website](https://img.shields.io/badge/Website-zen--reader.madeinchile.tech-954D28?style=for-the-badge)](https://zen-reader.madeinchile.tech/)
[![Made in Chile](https://madeinchile.tech/badge.svg)](https://madeinchile.tech)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<br/>

**Tu santuario de lectura web local, privado y sin distracciones.**  
*Guarda artículos con un solo clic y léelos después 100% offline — sin cuentas, sin telemetría y sin servidores en la nube.*

<br/>

<details>
  <summary>🇺🇸 <b>Click here to read in English / Read in English</b></summary>
  <br/>

  **Zen Reader** is a minimalist, local-first, and privacy-focused read-it-later browser extension. Save web articles with one click and read them distraction-free anytime — 100% offline, zero tracking, no accounts, and no cloud dependencies.

  ### ✨ Core Highlights:
  - 🔒 **100% Local & Offline:** Stored securely in your browser's IndexedDB.
  - 📖 **Distraction-Free:** Clean reader view removing clutter, ads, and popups.
  - ⚡ **Zero Cloud Lock-in:** Full data export/import whenever you want.
</details>

</div>

---

## 🚀 Instalación Rápida

| Navegador | Estado / Enlace | Método |
| :--- | :--- | :--- |
| 🦊 **Firefox / Zen Browser** | [![Firefox Add-ons](https://img.shields.io/badge/Instalar_en_Firefox-AMO-orange?logo=firefox-browser)](https://addons.mozilla.org/es-ES/firefox/addon/zenreader/) | **[Descargar desde Firefox Add-ons](https://addons.mozilla.org/es-ES/firefox/addon/zenreader/)** *(1 clic)* |
| 🌐 **Chrome / Brave / Edge / Arc** | [![Releases](https://img.shields.io/badge/GitHub-Releases-blue?logo=github)](https://github.com/MatiasBlanc/zen-reader/releases) | **[Descargar paquete .zip](https://github.com/MatiasBlanc/zen-reader/releases)** *(Cargar descomprimida)* |
| 💻 **Página Web Oficial** | [![Landing](https://img.shields.io/badge/Web-zen--reader.madeinchile.tech-954D28)](https://zen-reader.madeinchile.tech/) | **[Ver simulador y comparativa](https://zen-reader.madeinchile.tech/)** |

---

## 🎯 Por qué existe

Pocket cerró en julio de 2025 y Omnivore en noviembre de 2024. Las alternativas actuales son servicios de suscripción mensual costosos o plataformas que requieren auto-hospedar servidores complejos (Wallabag). 

**Zen Reader** apuesta por el minimalismo radical:
- **100% Local & Offline**: Tus artículos se guardan en el IndexedDB de tu navegador.
- **Sin Servidores**: Cero costos, cero riesgos de cierre de servicio en la nube.
- **Privacidad Total**: Lo que lees nunca sale de tu dispositivo. Cero analíticas, cero rastreadores.
- **Rápido y Liviano**: Carga instantánea con cero impacto de memoria en segundo plano.

---

## ✨ Atajo de Teclado

- Guarda cualquier artículo instantáneamente presionando:  
  `Alt + Shift + S` (o haz clic en el icono en la barra de extensiones).

---

## 📚 Documentación

La documentación técnica del proyecto está indexada en [`docs/README.md`](docs/README.md):

| Documento | Contenido |
| :--- | :--- |
| [docs/roadmap.md](docs/roadmap.md) | Features de V1 y plan V2/V3/V4, enlazado a issues y milestones |
| [docs/development.md](docs/development.md) | Entorno de desarrollo, debugging y build para AMO |
| [docs/decisions/](docs/decisions/) | ADRs — decisiones de arquitectura con contexto |
| [docs/spec/v1.md](docs/spec/v1.md) | Spec histórica de desarrollo de la V1 (detalle de arquitectura, modelo de datos, paleta, criterios de aceptación) |

---

## 🛠 Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **UI** | Preact |
| **Bundler** | Vite + `@crxjs/vite-plugin` |
| **Estilos** | Tailwind CSS v4 |
| **Estado** | Zustand |
| **Persistencia** | Dexie.js (IndexedDB) + `unlimitedStorage` |
| **Parsing** | Readability.js (Mozilla) |
| **Sanitización** | DOMPurify |
| **i18n** | `chrome.i18n` nativo |
| **Backend** | Ninguno — 100% local en tu navegador |

---

## 📁 Estructura del Monorepo

- **[`app/`](app/)**: Código fuente de la extensión de navegador (Manifest V3, Clean Architecture, Preact + Tailwind).
- **[`web/`](web/)**: Landing page oficial ([`zen-reader.madeinchile.tech`](https://zen-reader.madeinchile.tech/)).

---

## 🏗 Arquitectura de la Extensión (`app/`)

Clean Architecture con 4 capas estrictamente desacopladas:

```
app/src/
├── domain/          # Entidades y funciones puras, sin dependencias externas
├── application/     # Casos de uso y contratos (ports)
├── infrastructure/  # Adaptadores: IndexedDB, Readability, notificaciones
├── background/      # Service worker (orquestación de eventos)
└── presentation/    # UI en Preact: clipper, popup, dashboard
```

> **Verificación automática**: Las reglas de dependencias se verifican en CI con `dependency-cruiser` (`npm run arch`).

---

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# ── Extensión (app) ──
npm run dev:app       # Vite Dev Server con HMR (Chrome/Edge)
npm run build:app     # Compilar extensión en app/dist
npm run build:firefox # Empaquetar .xpi para Firefox / Zen Browser
npm run arch          # Verificar arquitectura con dependency-cruiser

# ── Landing Page (web) ──
npm run dev:web       # Vite Dev Server para la landing page
npm run build:web     # Compilar landing page estática en web/dist
```

---

## 📦 Carga Manual en el Navegador

Para compilar todo el proyecto:
```bash
npm run build
```

- **Chrome / Brave / Edge**:
  1. Abre `chrome://extensions` o `edge://extensions`
  2. Activa el "Modo desarrollador"
  3. Haz clic en "Cargar extensión sin empaquetar" y selecciona `app/dist/`

- **Firefox / Zen Browser**:
  1. Empaqueta la extensión: `npm run build:firefox`
  2. Abre `about:debugging#/runtime/this-firefox`
  3. Haz clic en "Cargar complemento temporal" y selecciona `app/dist/zen-reader.xpi`

---

## 🤝 Contribuir

Lee [`CONTRIBUTING.md`](CONTRIBUTING.md) antes de abrir un Pull Request. Para proponer nuevas funciones, usa la plantilla de [Feature Request](.github/ISSUE_TEMPLATE/feature_request.yml).

---

## 📄 Licencia

Licenciado bajo la **Licencia MIT**. Consulta [LICENSE](LICENSE) para más detalles.

Creado con serenidad por [Made in Chile](https://madeinchile.tech).
