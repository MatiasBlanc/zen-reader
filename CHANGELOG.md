# Changelog

Todas las versiones notables de ZenReader. Formato basado en
[Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

> El proyecto aún no ha publicado una versión estable (package.json: `0.0.0`).
> Mientras tanto, los cambios se acumulan en `[Unreleased]`. Cuando se publique
> una versión, los cambios se mueven a su sección y se crea un
> [Release](https://github.com/MatiasBlanc/zen-reader/releases) en GitHub.

## [Unreleased]

### Añadido

- Extensión Manifest V3: clipper de 1 clic, dashboard/New Tab, modo lector con
  dos temas, popup, i18n ES/EN, persistencia local con IndexedDB (Dexie).

### Documentación

- Reestructuración de `docs/`: índice (`docs/README.md`), `development.md`,
  ADRs (`docs/decisions/`), spec histórica (`docs/spec/v1.md`), roadmap
  enlazado a issues.
- Templates de issues (feature request y bug report) y de pull requests.
- Verificación de arquitectura en CI con dependency-cruiser (`npm run arch`)
  — ADR-0003.
