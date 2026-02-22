export type LocalizedText = {
  es: string;
  en: string;
};

export type Project = {
  title: LocalizedText;
  description: LocalizedText;
  details: LocalizedText;
  highlights: LocalizedText[];
  stack: string[];
  imageSrc: string;
  imageAlt: LocalizedText;
  repoUrl?: string;
  liveUrl?: string;
};

export type Skill = {
  label: LocalizedText;
  iconName:
  | "braces"
  | "atom"
  | "smartphone"
  | "swatchbook"
  | "workflow"
  | "git-branch"
  | "globe"
  | "figma"
  | "github"
  | "server";
};

export type SoftSkill = {
  title: LocalizedText;
  description: LocalizedText;
};

export type ExperienceItem = {
  period: LocalizedText;
  role: LocalizedText;
  company: string;
  location: LocalizedText;
  highlights: LocalizedText[];
};

export type EducationItem = {
  title: LocalizedText;
  institution: string;
  location: LocalizedText;
  period: LocalizedText;
  summary: LocalizedText;
};

export type Profile = {
  name: string;
  title: LocalizedText;
  location: LocalizedText;
  email: string;
  linkedin: string;
  portfolio: string;
  summary: LocalizedText;
};

export const profile: Profile = {
  name: "Santiago Giraldo",
  title: {
    es: "Desarrollador Web y Mobile",
    en: "Web & Mobile Developer",
  },
  location: {
    es: "Manizales, Colombia",
    en: "Manizales, Colombia",
  },
  email: "sgiraldo118@gmail.com",
  linkedin: "https://linkedin.com/in/santiago-giraldo-dev/",
  portfolio: "https://bolsitadp.github.io/portfolio/",
  summary: {
    es: "Desarrollador Web y Mobile con más de 4 años de experiencia construyendo aplicaciones escalables y listas para producción con React, React Native y Next.js. Tengo una base sólida en arquitectura frontend, manejo de estado y optimización de rendimiento, con experiencia práctica entregando plataformas de nivel empresarial. He demostrado capacidad para traducir diseños complejos de Figma en interfaces accesibles y responsive, colaborar con equipos ágiles internacionales y entregar funcionalidades de alta calidad en entornos de trabajo rápidos.",
    en: "Web & Mobile Developer with 4+ years of experience building scalable, production-grade applications using React, React Native, and Next.js. Strong background in frontend architecture, state management, and performance optimization, with hands-on experience delivering enterprise-level platforms. Proven ability to translate complex Figma designs into accessible, responsive UIs, collaborate in international agile teams, and ship high-quality features in fast-paced environments.",
  },
};

export const projects: Project[] = [
  {
    title: { es: "Cervecería", en: "Brewery Management" },
    description: {
      es: "Sistema de planificación y control de producción para una planta de cervezas y refrescos, creado para reemplazar la operación basada en Excel.",
      en: "Production planning and control system for a brewery and soft-drinks plant, built to replace an Excel-based operation.",
    },
    details: {
      es: "El proyecto nació al identificar una oportunidad clara de mejora en la gestión de la producción, que hasta ese momento se realizaba en hojas de Excel. Diseñamos un sistema centralizado para conectar las necesidades de programación de turnos, operación en planta y supervisión gerencial. La solución permitía que quienes programaban la producción, los trabajadores que requerían horarios impresos en fábrica y los gerentes que necesitaban estadísticas e información operativa trabajaran sobre un flujo más ordenado, confiable y escalable.",
      en: "This project started after identifying a clear improvement opportunity in production management, which was previously handled through Excel spreadsheets. We designed a centralized system that connected scheduling, plant-floor operations, and management oversight. The solution allowed production planners, factory workers who required printed schedules, and managers who needed statistics and operational insights to work within a more organized, reliable, and scalable workflow.",
    },
    highlights: [
      {
        es: "Digitalización de la programación de producción para cervezas y refrescos, reemplazando procesos manuales en Excel.",
        en: "Digitized production scheduling for beers and soft drinks, replacing manual Excel-based processes.",
      },
      {
        es: "Gestión de fórmulas, cantidades, materias primas, tiempos de producción, descansos y limpiezas entre lotes/productos.",
        en: "Managed formulas, quantities, raw materials, production times, breaks, and cleaning windows between batches/products.",
      },
      {
        es: "Unificó la información para operación, planeación y gerencia, facilitando seguimiento, coordinación y consulta de estadísticas.",
        en: "Unified information for operations, planning, and management, improving coordination, tracking, and access to statistics.",
      },
    ],
    stack: [ "React", "TypeScript", "MUI components", ".Net", "Redux" ],
    imageSrc: "/projects/project-1/cerveceria.jpg",
    imageAlt: {
      es: "Vista del proyecto de cerveceria",
      en: "Brewery project screenshot",
    },
    liveUrl: "",
    repoUrl: "",
  },
  {
    title: { es: "Genfar", en: "Genfar Supplier Module" },
    description: {
      es: "Modernización de un sistema legacy para gestionar fórmulas, servicios, auditorías y documentación legal en una operación farmacéutica.",
      en: "Modernization of a legacy system used to manage formulas, services, audits, and legal documentation in a pharmaceutical operation.",
    },
    details: {
      es: "Genfar contaba con un sistema obsoleto para administrar procesos clave relacionados con fórmulas, servicios, auditorías y documentación legal, lo que hacía la operación más compleja y difícil de entender para distintos perfiles de usuario. Participamos en la construcción de un sistema completamente nuevo, con una experiencia más clara y ordenada, orientada a facilitar el trabajo diario de colaboradores internos, mejorar la consulta de información para gerencia y simplificar la revisión de evidencias y procesos por parte de auditores.",
      en: "Genfar had an outdated system to manage key processes related to formulas, services, audits, and legal documentation, which made the operation more complex and harder to understand for different user profiles. We participated in building a completely new system with a clearer, more organized experience, designed to support day-to-day work for internal teams, improve information access for management, and simplify evidence/process review for auditors.",
    },
    highlights: [
      {
        es: "Reemplazo de un sistema legacy por una plataforma más clara y mantenible para procesos operativos y regulatorios.",
        en: "Replaced a legacy system with a clearer and more maintainable platform for operational and regulatory processes.",
      },
      {
        es: "Gestión centralizada de fórmulas, servicios, auditorías y documentos legales en un entorno farmacéutico.",
        en: "Centralized management of formulas, services, audits, and legal documents in a pharmaceutical environment.",
      },
      {
        es: "Mejora de usabilidad y comprensión del sistema para trabajadores, gerentes y auditores.",
        en: "Improved usability and system understanding for workers, managers, and auditors.",
      },
    ],
    stack: [ "React", ".Net", "UI/UX", "Operations", "MUI components", "Redux" ],
    imageSrc: "/projects/project-2/genfar.png",
    imageAlt: {
      es: "Captura del módulo de Genfar",
      en: "Genfar module screenshot",
    },
    liveUrl: "",
    repoUrl: "",
  },
  {
    title: { es: "Process App", en: "Process App" },
    description: {
      es: "Sistema de control interno para trazabilidad operativa, gestión de pendientes y seguimiento del trabajo de equipos de desarrollo.",
      en: "Internal control system for operational traceability, backlog management, and tracking development team work.",
    },
    details: {
      es: "Process App fue creada como una plataforma de control interno para centralizar la trazabilidad de las operaciones de la empresa. Incluía funcionalidades de management para que gerentes y team leaders pudieran hacer seguimiento al trabajo del equipo de desarrollo: tareas pendientes, actividades completadas y requerimientos generales en curso. Además, consolidaba estadísticas clave de la operación. El sistema fue diseñado completamente desde cero y luego implementado en más de 10 clientes, con personalización por empresa (colores corporativos, branding e incluso temas para fechas especiales).",
      en: "Process App was created as an internal control platform to centralize operational traceability across the company. It included management features that allowed managers and team leaders to track the development team's work: pending tasks, completed activities, and general ongoing requests. It also consolidated key operational statistics. The system was designed entirely from scratch and later implemented across more than 10 clients, with company-specific customization (corporate colors, branding, and even special themes for specific dates/seasons).",
    },
    highlights: [
      {
        es: "Control interno y trazabilidad de operaciones con seguimiento de pendientes y tareas completadas.",
        en: "Internal control and operational traceability with tracking of pending and completed tasks.",
      },
      {
        es: "Visibilidad para gerentes y team leaders sobre carga de trabajo, estado de tareas y estadísticas operativas.",
        en: "Visibility for managers and team leaders into workload, task status, and operational statistics.",
      },
      {
        es: "Diseño desde cero e implementación multi-cliente con personalización por marca, colores corporativos y temas especiales.",
        en: "Designed from scratch and deployed as a multi-client solution with brand-specific customization, corporate colors, and seasonal themes.",
      },
    ],
    stack: [ "Vue", "Forms", "Operations", ".Net", "Internal Tools" ],
    imageSrc: "/projects/project-3/process.jpg",
    imageAlt: {
      es: "Captura de la aplicación de procesos",
      en: "Process app screenshot",
    },
    liveUrl: "",
    repoUrl: "",
  },
  {
    title: { es: "Sitio BPMco", en: "BPMco Website" },
    description: {
      es: "Rediseño del sitio web corporativo de BPMco como parte de la renovación de su imagen de marca, enfocado en una presentación más moderna.",
      en: "Redesign of BPMco's corporate website as part of its brand refresh, focused on delivering a more modern presentation.",
    },
    details: {
      es: "Durante el proceso de renovación de la imagen corporativa de BPMco, el sitio web también fue replanteado para alinearse con la nueva identidad visual y transmitir una sensación de modernidad. La idea era convertir la web en una carta de presentación sólida de la empresa, con mejor estructura visual, mejor experiencia de navegación y una base técnica más actual. Para ello se trabajaron tecnologías más recientes y un enfoque de arquitectura más moderno, buscando un resultado mantenible y escalable.",
      en: "During BPMco's corporate image refresh, the website was also redesigned to align with the new visual identity and communicate a stronger sense of modernity. The goal was to turn the website into a strong company showcase, with a better visual structure, improved browsing experience, and a more up-to-date technical foundation. To achieve this, newer technologies and a more modern architectural approach were used, aiming for a maintainable and scalable result.",
    },
    highlights: [
      {
        es: "Rediseño del sitio para alinearlo con la nueva imagen corporativa de BPMco.",
        en: "Website redesign aligned with BPMco's new corporate identity.",
      },
      {
        es: "Enfoque en una experiencia visual moderna para reforzar la web como carta de presentación de la empresa.",
        en: "Focus on a modern visual experience to reinforce the website as the company's presentation card.",
      },
      {
        es: "Uso de tecnologías y enfoques arquitectónicos más actuales para mejorar mantenibilidad y escalabilidad.",
        en: "Used newer technologies and architectural approaches to improve maintainability and scalability.",
      },
    ],
    stack: [ "React", "MUI components", "Responsive UI" ],
    imageSrc: "/projects/project-4/bpmco_website.jpg",
    imageAlt: {
      es: "Captura del sitio web de BPMco",
      en: "BPMco website screenshot",
    },
    liveUrl: "",
    repoUrl: "",
  },
];

export const skills: Skill[] = [
  { label: { es: "JavaScript / TypeScript", en: "JavaScript / TypeScript" }, iconName: "braces" },
  { label: { es: "React / Next.js", en: "React / Next.js" }, iconName: "atom" },
  { label: { es: "React Native", en: "React Native" }, iconName: "smartphone" },
  { label: { es: "HTML / CSS / Tailwind", en: "HTML / CSS / Tailwind" }, iconName: "swatchbook" },
  { label: { es: "Arquitectura Frontend", en: "Frontend Architecture" }, iconName: "workflow" },
  { label: { es: "Redux Toolkit", en: "Redux Toolkit" }, iconName: "git-branch" },
  { label: { es: "APIs REST", en: "REST APIs" }, iconName: "globe" },
  { label: { es: "De Figma a UI", en: "Figma to UI" }, iconName: "figma" },
  { label: { es: "Git / GitHub", en: "Git / GitHub" }, iconName: "github" },
  { label: { es: "Node.js", en: "Node.js" }, iconName: "server" },
];

export const experience: ExperienceItem[] = [
  {
    period: { es: "Ene 2025 - Actualidad", en: "Jan 2025 - Present" },
    role: { es: "Frontend Developer", en: "Frontend Developer" },
    company: "Helixdev.io",
    location: { es: "Remoto", en: "Remote" },
    highlights: [
      {
        es: "Reconstrucción de una plataforma de gestión de telecomunicaciones para una empresa canadiense usando Next.js 15, TypeScript y Tailwind CSS.",
        en: "Rebuilt a telecommunications management platform for a Canadian enterprise using Next.js 15, TypeScript, and Tailwind CSS.",
      },
      {
        es: "Traducción de diseños de alta fidelidad en Figma a interfaces totalmente responsive y accesibles para desktop y mobile.",
        en: "Translated high-fidelity Figma designs into fully responsive and accessible interfaces for desktop and mobile.",
      },
      {
        es: "Implementación de Redux Toolkit y consumo de APIs REST para mejorar el rendimiento.",
        en: "Implemented Redux Toolkit state management and REST API integration to enhance performance.",
      },
      {
        es: "Colaboración con equipos internacionales multidisciplinarios bajo Scrum, usando flujos CI/CD en GitLab.",
        en: "Collaborated with cross-functional international teams under Scrum, using GitLab CI/CD workflows.",
      },
    ],
  },
  {
    period: { es: "Mar 2022 - Dic 2024", en: "Mar 2022 - Dec 2024" },
    role: { es: "Fullstack Developer", en: "Fullstack Developer" },
    company: "BPMco",
    location: { es: "Manizales, Colombia", en: "Manizales, Colombia" },
    highlights: [
      {
        es: "Desarrollo de una aplicación de gestión de producción para Inversiones CentroAmericanas S.A., reemplazando flujos en Excel.",
        en: "Developed a production management application for Inversiones CentroAmericanas S.A., replacing Excel workflows.",
      },
      {
        es: "Lideré el rediseño de módulos de gestión de proveedores para Genfar S.A., mejorando usabilidad y eficiencia operativa.",
        en: "Led the redesign of supplier management modules for Genfar S.A., improving usability and operational efficiency.",
      },
      {
        es: "Modernización del sistema interno de BPMco, automatizando procesos clave.",
        en: "Modernized BPMco's internal management system, automating key processes.",
      },
      {
        es: "Construcción de formularios digitales de control para Cafe Duran (Empresa Panameña de Alimentos) para mejorar la supervisión operativa.",
        en: "Built digital control forms for Cafe Duran (Empresa Panameña de Alimentos) to improve operational oversight.",
      },
    ],
  },
  {
    period: { es: "Ene 2021 - Dic 2021", en: "Jan 2021 - Dec 2021" },
    role: { es: "Frontend Developer", en: "Frontend Developer" },
    company: "GyE Seguros",
    location: { es: "Manizales, Colombia", en: "Manizales, Colombia" },
    highlights: [
      {
        es: "Modernización del sitio web de la empresa para mejorar UI/UX.",
        en: "Modernized the company website to improve UI/UX.",
      },
      {
        es: "Construcción de una aplicación ligera de agendamiento de citas, optimizando el proceso de reservas.",
        en: "Built a lightweight appointment scheduling application, streamlining the booking process.",
      },
    ],
  },
];

export const education: EducationItem[] = [
  {
    title: {
      es: "Técnico en Desarrollo de Software",
      en: "Software Developer Technician",
    },
    institution: "Servicio Nacional de Aprendizaje (SENA)",
    location: { es: "Manizales, Colombia", en: "Manizales, Colombia" },
    period: { es: "Dic 2018", en: "Dec 2018" },
    summary: {
      es: "Programa integral enfocado en principios de desarrollo de software, lenguajes de programación y prácticas de ingeniería de software. Incluyó experiencia práctica desarrollando aplicaciones y resolviendo problemas de software.",
      en: "Completed a comprehensive program focused on software development principles, programming languages, and software engineering practices. Gained hands-on experience developing applications and troubleshooting software issues.",
    },
  },
  {
    title: {
      es: "Introducción a la Robótica",
      en: "Introduction to Robotics",
    },
    institution: "Servicio Nacional de Aprendizaje (SENA)",
    location: { es: "Manizales, Colombia", en: "Manizales, Colombia" },
    period: { es: "Dic 2018", en: "Dec 2018" },
    summary: {
      es: "Curso introductorio sobre robótica, automatización y programación para sistemas robóticos, con práctica en kits básicos y entornos de programación.",
      en: "Introductory training in robotics, automation, and programming for robotic systems, including practice with basic kits and programming environments.",
    },
  },
];

export const softSkills: SoftSkill[] = [
  {
    title: { es: "Comunicación", en: "Communication" },
    description: {
      es: "Clara y asertiva en discusiones de equipo y code reviews.",
      en: "Clear and assertive in team discussions and code reviews.",
    },
  },
  {
    title: { es: "Resolución de Problemas", en: "Problem-Solving" },
    description: {
      es: "Enfoque creativo frente a retos técnicos con foco en eficiencia.",
      en: "Creative approach to technical challenges with focus on efficiency.",
    },
  },
  {
    title: { es: "Adaptabilidad", en: "Adaptability" },
    description: {
      es: "Aprendizaje rápido y buen desempeño en entornos dinámicos e internacionales.",
      en: "Quick learner who thrives in dynamic and international environments.",
    },
  },
  {
    title: { es: "Colaboración", en: "Collaboration" },
    description: {
      es: "Buen trabajo en equipo con enfoque en entregar valor en equipos cross-functional.",
      en: "Strong team player committed to delivering value in cross-functional teams.",
    },
  },
];
