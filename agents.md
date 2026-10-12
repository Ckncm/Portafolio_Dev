# AGENTS.md - Contexto y Directrices del Proyecto

## 1. Descripción General del Proyecto
- **Nombre:** Portafolio Personal de Erick Cuá.
- **Propósito:** Sitio web interactivo y profesional para mostrar proyectos de desarrollo (Flutter, React, videojuegos, etc.) y experiencia técnica.
- **Público objetivo:** Reclutadores, desarrolladores y clientes potenciales.

## 2. Stack Tecnológico
- **Core:** React (con **Vite** como empaquetador).
- **Estilos:** **Tailwind CSS** (utilizando clases utilitarias).
- **Control de Versiones:** Git / GitHub.
- **Hosting / Despliegue:** GitHub Pages.

## 3. Arquitectura y Estructura de Carpetas
El proyecto sigue una estructura modular y limpia dentro de `src/`:
- `src/components/`: Componentes pequeños y reutilizables (Botones, Tarjetas, Navbar).
- `src/sections/`: Secciones completas de la página principal (Hero, About, Projects, Contact).
- `src/data/`: Archivos estáticos de datos (ej. lista de proyectos, habilidades).
- `src/assets/`: Imágenes e íconos locales.

## 4. Convenciones de Código y Estilo
- **Componentes:** Usar siempre **componentes funcionales** de React con sintaxis moderna (Arrow Functions o funciones tradicionales).
- **Nomenclatura:**
  - Componentes: `PascalCase` (Ej. `ProjectCard.jsx`).
  - Variables y funciones: `camelCase` (Ej. `isLoaded`, `handleToggle`).
  - Clases de CSS: Exclusivamente clases utilitarias de Tailwind CSS. Evitar archivos `.css` adicionales a menos que sea estrictamente necesario.
- **Modularidad:** Mantener los archivos con una sola responsabilidad clara. Si un componente supera las 150 líneas, evaluar dividirlo en subcomponentes.

## 5. Datos y Mantenimiento
- Los datos de los proyectos **nunca** deben estar hardcodeados dentro del componente visual de forma directa; deben centralizarse en un archivo de datos (ej. `src/data/projects.js`) y renderizarse usando `.map()`.

## 6. Comandos del Entorno de Desarrollo
- Iniciar servidor local: `npm run dev`
- Compilar para producción: `npm run build`

## 7. Restricciones para el Asistente de IA
- No instalar paquetes de npm adicionales (como librerías de iconos pesadas o frameworks de UI externos) sin consultarlo previamente.
- Priorizar código limpio, accesible (semántica HTML correcta) y altamente responsivo (diseño adaptable a celulares y computadoras con Tailwind).