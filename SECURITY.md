# Seguridad — Zen Reader

Zen Reader es una extensión **100% local**: no realiza peticiones de red y todo
el procesamiento ocurre en el dispositivo. Aun así, maneja contenido HTML de
páginas de terceros, que es la superficie de riesgo principal (XSS).

## Reportar una vulnerabilidad

**No abras un issue público.** Usa el mecanismo privado nativo de GitHub:

1. Pestaña **Security** del repositorio → **Report a vulnerability**.
2. Describe el problema, los pasos para reproducirlo y el impacto estimado.

El reporte permanece privado hasta que se resuelva o se decida divulgarlo.

## Qué reportar

- Ejecución de scripts o markup inyectado al abrir un artículo clippeado
  (fallo de sanitización).
- Fuga de datos de artículos/preferencias fuera del dispositivo.
- Permisos excesivos o uso indebido de los permisos declarados.

## Defensas existentes

- Sanitización con DOMPurify en dos puntos (extracción y carga en el lector),
  bloqueando `script`, `style`, `iframe`, `object`, `embed`, `form` e `input`.
- El contenido HTML solo se renderiza en `ReaderView` ya sanitizado.
- Permisos mínimos (`storage`, `unlimitedStorage`, `scripting`, `activeTab`);
  el content script se inyecta solo cuando el usuario clippea.

## Política de divulgación

- **Críticas** (RCE, fuga de datos): parche y aviso a afectados lo antes posible.
- **Medias/bajas** (XSS contenido, UX engañosa): resolución en la siguiente
  versión y mención en las notas del release.
