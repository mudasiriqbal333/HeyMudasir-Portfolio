// All personal/text content for the About page lives here.
// Swap these values to update the page — no component edits needed.
// Every fact below comes from the owner's LinkedIn profile and CV
// (public/mudasir-iqbal-cv.pdf). Where the two disagree, LinkedIn, the more
// recent of the two, wins.

//? The CV the page and the top bar link to
export const cvFile = {
  href: '/mudasir-iqbal-cv.pdf',
  label: 'Download CV',
  short: 'CV',
};

export const aboutOptions = {
  // Big hero heading (each string is its own line on desktop).
  heading: ['Full stack engineer', 'building with AI'],

  // Intro block: portrait image + supporting copy.
  intro: {
    image: '/mudasir.webp',
    imageAlt: 'Mudasir Iqbal',
    paragraph:
      'I’m a software engineer with a Software Engineering degree from NUST, building full stack web and mobile apps with React, Next.js, Node.js and MongoDB. I’ve shipped features for a CRM used by property dealers across the US, delivered iOS and Android apps, and led FitMaster AI, an AI fitness app with real-time posture detection, as my final year project.',
    note: 'Currently at AlgoTracks and REHQ',
  },

  // Where the owner has worked, newest first. Each row opens on a click to
  // show what was done there and the case pages of what was built.
  // `logo` sits on `background` in the preview that follows the mouse and
  // in the opened row; a row without one shows neither. `company` must be
  // unique: it keys the row.
  experience: {
    heading: 'Experience',
    labels: ['Company', 'Role', 'Location', 'Years'],
    items: [
      {
        company: 'AlgoTracks',
        role: 'Senior Software Engineer',
        location: 'London, UK',
        years: '2025 – Present',
        logo: '/about/companies/algotracks.png',
        background: '#ffffff',
        //? Neither LinkedIn nor the CV describes this role yet: add two to
        //? four lines on what you do here
        points: [],
        projects: [],
      },
      {
        company: 'REHQ',
        role: 'React Developer',
        location: 'Remote, US',
        years: '2025 – Present',
        logo: '/about/companies/rehq.svg',
        //? REHQ's brand teal, behind its white logo
        background: '#35746e',
        points: [
          'Develop and maintain a large-scale CRM for property dealers in the US market in React.js, with designers, back end developers and QA in an Agile team.',
          'Built the Twilio call recording, transcription and AI call-summary pipeline, with a WhatsApp-style transcript view and one-click task creation from each summary.',
          'Designed and shipped record merging and duplicate handling for contacts, properties, companies, tasks and notes, with field-level conflict resolution, and led the CSV import overhaul that reduced failed imports.',
          'Design Node.js APIs and MongoDB data models for core features, including authentication and role-based access, and cut the API calls made on app load by caching reference data.',
        ],
        projects: [{ title: 'REHQ', href: '/work/rehq' }],
      },
      {
        company: 'Smart TechOne',
        role: 'Junior Software Engineer',
        location: 'Islamabad, Pakistan',
        years: '2025 – 2026',
        points: [
          'Worked as a back end developer in FastAPI on a Digital Twin project.',
          'Developed and delivered iOS and Android apps, and built front and back end features of scalable web applications, including SMTP email and web service integrations.',
          'Applied Agile practices, code reviews and testing to keep the applications robust.',
        ],
        projects: [],
      },
      {
        //? Two roles at one company, as LinkedIn groups them
        company: 'Synergy Consulting Services',
        role: 'Web Application Developer',
        location: 'Islamabad, Pakistan',
        years: '2021 – 2025',
        points: [
          'Web Application Developer (2024 – 2025): contributed to the design and implementation of scalable, efficient back end systems.',
          'Digital Marketing Manager (2021 – 2024): grew companies’ reach and sales through digital marketing, and taught courses to students.',
        ],
        projects: [],
      },
      {
        company: 'InoTech Solutions',
        role: 'Intern',
        //? Not on the CV
        location: '',
        years: '2024',
        points: [
          'Developed an internship management system in PHP and Laravel.',
          'Built applications with the InoTech team under a project manager and team lead, focused on high-quality back end solutions.',
        ],
        projects: [],
      },
      {
        company: 'Zia Law Firm',
        role: 'Software Engineer',
        location: 'Jhelum, Pakistan',
        years: '2021',
        //? Not described on LinkedIn yet
        points: [],
        projects: [],
      },
    ],
  },

  // "What I work with ..." list, in the layout of the reference's services.
  services: {
    heading: 'What I work with',
    items: [
      {
        no: '01',
        title: 'Full stack development',
        description:
          'React, Next.js and Tailwind CSS on the front end, with Node.js, Express, FastAPI and Laravel behind it on MongoDB, SQL and AWS: web apps and iOS and Android apps, from Figma designs to production.',
      },
      {
        no: '02',
        title: 'AI products',
        description:
          'AI inside real products: Twilio call transcription and AI call summaries that become tasks at REHQ, and FitMaster AI, my final year project, with real-time posture detection in MediaPipe and TensorFlow and an AI fitness chatbot.',
      },
      {
        no: '03',
        title: 'Leadership',
        starred: true,
        description:
          'I led my final year project and REHQ’s CSV import overhaul. At NUST I was President of the Software Society (2024–25), organised DevCon ’25, and served as a team lead at the NUST Hackathon 2023, where I received the Excellence in Event Management award.',
      },
    ],
  },

  // Degrees, then certificates. `href` is where each certificate can be
  // verified and `image` is the certificate shown by the mouse; a
  // certificate without `href` is listed as a plain row.
  credentials: {
    heading: 'Education and certifications',
    education: [
      {
        label: '2025',
        title: 'Bachelor of Software Engineering',
        school: 'National University of Sciences and Technology (NUST)',
      },
    ],
    labels: ['Certificate', 'Issued by', 'Year'],
    //? From the CV, which gives no year or link: add `year: '2024'`,
    //? `href: '<verification URL>'` and `image: '/about/certificates/<file>'`
    //? to each when you have them.
    certifications: [
      {
        title: 'Artificial Intelligence & Machine Learning',
        issuer: 'Coursera',
      },
      {
        title: 'The Web Development Bootcamp',
        issuer: 'Coursera',
      },
    ],
  },

  // Feature block (image + rotating badge + heading + text).
  feature: {
    image: '/mudasir.webp',
    imageAlt: 'Mudasir Iqbal at work',
    badge: {
      //? Text that runs around the rotating badge; keep the trailing separator.
      text: 'Full Stack Engineer · Web & AI · ',
      mark: 'MI',
    },
    //? Since the first software role, at Zia Law Firm in 2021
    title: ['Full stack engineer', 'Software since ’21'],
    description:
      'I build fast, reliable software from the database to the interface, and add AI where it genuinely helps the people using it.',
  },
};
