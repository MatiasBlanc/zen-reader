# 0002 — Inyección del content script bajo demanda

- **Estado**: Aceptado
- **Fecha**: 2025-07

## Contexto

El clipper necesita ejecutar código (Readability.js) dentro de páginas web de
terceros. La forma más directa es declarar un content script permanente con
permiso `<all_urls>`, pero eso significa que la extensión corre código en
**todas** las pestañas siempre, con footprint constante y un permiso
alarmante para una extensión que promete privacidad y cero impacto en RAM.

## Decisión

Se decidió **no** declarar el content script en el manifest y en su lugar
inyectarlo bajo demanda con `chrome.scripting.executeScript` usando los
permisos `activeTab` + `scripting`. El script solo se ejecuta cuando el
usuario clippea (clic en el icono, atajo, o botón del popup), nunca durante la
navegación normal.

Permisos finales del manifest: `storage`, `unlimitedStorage`, `scripting`,
`activeTab`. Sin `<all_urls>`.

## Alternativas consideradas

- **Content script declarativo permanente con `<all_urls>`** — más simple de
  implementar y permite escuchar eventos de la página, pero corre en todas las
  pestañas, añade footprint y contradice la filosofía de privacidad del
  producto. Descartada.
- **Content script declarativo con coincidencias limitadas** (`https://*/*`)
  — reduce el footprint pero sigue ejecutándose siempre, y complica el caso de
  páginas restringidas (chrome://, Web Store). Descartada.

## Consecuencias

**Positivas**

- Cero código de la extensión corriendo durante la navegación normal.
- Permisos mínimos y transparentes en la store.
- Alineado con la promesa del producto ("100% local, cero impacto").

**Negativas**

- El clipper falla en páginas restringidas (chrome://, PDFs, Web Store) donde
  `chrome.scripting` no puede inyectar; el error hoy solo llega al notificador
  silencioso del SW (console). Pendiente de mejora: badge `!` temporal o
  `chrome.notifications` (ver roadmap, "Complementos de V1").
- Requiere esperar a que la página termine de cargar el DOM que se va a leer.
