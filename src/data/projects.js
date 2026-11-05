import calet1 from '../assets/proyectos/Calet/1.webp'
import calet2 from '../assets/proyectos/Calet/2.webp'
import calet3 from '../assets/proyectos/Calet/3.webp'
import calet4 from '../assets/proyectos/Calet/4.webp'
import calet5 from '../assets/proyectos/Calet/5.webp'
import calet6 from '../assets/proyectos/Calet/6.webp'
import calet7 from '../assets/proyectos/Calet/7.webp'

import caletLogo from '../assets/logos/calet_logo.webp'
import googlePlayLogo from '../assets/logos/google_Play.webp'
import appStoreLogo from '../assets/logos/appstore.webp'
import caletCover from '../assets/portadas/calet.webp'

export const projects = [
  {
    id: 'calet',
    title: 'Calet',
    description:
      'Proyecto independiente desarrollado en equipo para conectar a la comunidad de jóvenes adventistas mediante la gestión y descubrimiento de eventos. Como co-desarrollador, lidero la arquitectura visual, la implementación de interfaces frontend y el diseño UI/UX, optimizando la experiencia de usuario y agregando mejoras continuas de calidad de vida (QoL) en sus versiones móviles y web.',
    cover: caletCover,
    links: [
      {
        label: 'Sitio Web',
        href: 'https://calet.app/',
        icon: caletLogo,
      },
      {
        label: 'Google Play',
        href: 'https://play.google.com/store/apps/details?id=com.gersonpm.calet&hl=es_GT',
        icon: googlePlayLogo,
      },
      {
        label: 'App Store',
        href: 'https://apps.apple.com/us/app/calet/id6761416439',
        icon: appStoreLogo,
      },
    ],
    images: [calet1, calet2, calet3, calet4, calet5, calet6, calet7],
  },
  // =========================================================================
  // PLANTILLAS DE PROYECTOS FUTUROS
  // Para agregar un nuevo proyecto, descomenta uno de los bloques de abajo
  // y completa los datos (título, descripción, portada, enlaces e imágenes).
  // =========================================================================
  /*
  {
    id: 'project-2',
    title: 'Proyecto 02',
    description:
      'Descripción del proyecto. Explica las tecnologías usadas, tu rol y el objetivo.',
    cover: null, // Importa la imagen de portada desde assets/portadas/
    links: [
      // { label: 'Sitio Web', href: 'https://...', icon: ... },
      // { label: 'Código fuente', href: 'https://github.com/...' },
    ],
    images: [], // [img1, img2, ...]
  },
  {
    id: 'project-3',
    title: 'Proyecto 03',
    description:
      'Descripción del proyecto. Explica las tecnologías usadas, tu rol y el objetivo.',
    cover: null,
    links: [],
    images: [],
  },
  {
    id: 'project-4',
    title: 'Proyecto 04',
    description:
      'Descripción del proyecto. Explica las tecnologías usadas, tu rol y el objetivo.',
    cover: null,
    links: [],
    images: [],
  },
  */
]
