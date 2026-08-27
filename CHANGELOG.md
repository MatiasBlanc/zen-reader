# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/)
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [2.0.0] - 2026-08-25

### 🚀 Rendimiento y Optimización de Tamaño (-72% de peso)
- **Reducción del paquete de extensión**: El archivo empaquetado `.xpi` pasa de **192 KB a 54 KB**.
- **Migración de almacenamiento a IndexedDB nativa**: Se eliminó la dependencia pesada de `Dexie` (~99 KB), reduciendo el bundle de persistencia a solo 3.7 KB manteniendo la misma estabilidad y esquema.
- **CSS Vanilla ligero**: Se eliminó por completo `tailwindcss` y `@tailwindcss/typography` (~36 KB de CSS genérico), sustituyéndolos por 12 KB de estilos CSS semánticos y tipografía de lectura artesanal.
- **Content Script ultra-optimizado**: Reducción de 192 KB a 39 KB al retirar el runtime de Preact del clipper inyectado y usar manipulación DOM directa en el Shadow DOM.
- **Sanitizador DOM nativo**: Sanitización XSS robusta basada en el árbol `DOMParser` nativo del navegador, eliminando la dependencia de `DOMPurify` (27 KB).
- **Imágenes e íconos optimizados**: Compresión de paleta PNG8 de 64 colores con reducción del 95% de tamaño y eliminación de assets duplicados.

### 🎨 Diseño y Marca
- **Nuevo logotipo Zen**: Integración del nuevo logotipo oficial ensō terracotta y favicons vectoriales actualizados.
- **Identidad unificada**: Nombre de la extensión actualizado formalmente a **Zen Reader**.

### 🛠️ Compatibilidad y Limpieza
- **Firefox MV3**: Ajuste de `strict_min_version` a `142.0` con soporte formal para `data_collection_permissions` (`isExempt: true`, sin recolección de datos).
- **Eliminación de dependencias de audio no esenciales**: Simplificación de la arquitectura interna retirando efectos de sonido sintetizados en favor de un rendimiento instantáneo y menor consumo de memoria.

---

## [1.0.0] - 2026-08-01

### ✨ Características Iniciales
- Extracción de artículos con un solo clic o atajo `Ctrl+Shift+S` mediante Readability.js.
- Dashboard de lectura integrado con temas claro (Papel) y oscuro.
- Soporte para navegación con teclado (`j`/`k`, `Enter`, `s`, `d`).
- Soporte multilingüe (Español e Inglés).
- Almacenamiento 100% local sin telemetría ni servidores externos.
