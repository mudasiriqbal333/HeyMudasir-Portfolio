// @ts-check
import { project } from '../project.js';

//? Pictures: the owner's screens of the new UI. The hero is the sign-in page
//? for the BMW Group; the five app screens were 4:3 and are widened to the
//? laptop's 16:10 with their own grey background, so the laptop shows no
//? black bars. The untouched exports are in originals/public/assets/simuspace/new-ui.
export default project({
  slug: 'simuspace',
  title: 'SIMuSPACE',
  //? The small line under the title, here and in the Work and Home lists.
  tagline: 'Powered by BMW',
  //? Short enough for one line in the Work list's services column.
  services: 'Front-End & Data Analytics',
  credits: 'Team SOCO Engineers',
  categories: ['development'],
  //? The company behind the product (SOCO engineers GmbH).
  location: 'Munich, Germany',
  //? Confirmed by the owner on 2026-11-03: SOCO Engineers, Mar 2024 – Jun 2025, as on the CV.
  year: '2024 – 2025',
  liveUrl: 'https://simuspace.ai/',
  //? The navy of the owner's thumbnail, behind the laptop and the moving row.
  background: '#0a1033',
  //? The owner's own design (Portfolio thumbnail@1x.png).
  thumbnail: 'thumbnail.png',
  description: {
    lead: 'SIMuSPACE is a simulation process and data management platform for engineering teams: a workflow manager, data management and analytics dashboards in one tool, used by companies such as BMW.',
    body: [
      'Built by SOCO engineers in Munich for CAE engineers, it standardises complex engineering processes, embeds third-party simulation software, drives HPC clusters and keeps every data change versioned and traceable, with local files kept in sync with the server. It runs on Java, Next.js and Postgres.',
      'I revamped the whole front end of the product, end to end, and built its data analytics: dashboards in the spirit of Power BI, drawn with Apache ECharts and Plotly, that stay fast on large simulation data thanks to memoization and careful use of hooks. Engineering and research teams at BMW work with it.',
    ],
    built: [
      'Front-end revamp of the whole product, end to end',
      'Analytics dashboards in the style of Power BI, with Apache ECharts and Plotly',
      'License monitoring, quality assurance and optimisation dashboards',
      'Charts that stay fast on large simulation data, with memoization and hooks',
      'Workflow designer and data screens, as part of the revamp',
    ],
  },
  hero: {
    'sign-in.webp':
      'SIMuSPACE sign-in page for the BMW Group, over a photo of a BMW coupe',
  },
  //? The analytics first (held longest), then workflow and analytics in turn.
  //? Pictures two to five also drift past in the row under the laptop.
  laptop: {
    'license-monitoring.png':
      'SIMuSPACE license monitoring dashboard: licence use over a month for MSC, Ansa, Abaqus and Abaqus-MJ',
    'workflow-designer.png':
      'SIMuSPACE workflow designer: a workflow drawn as connected steps, from input and Python scripts to export, email and sub-workflows',
    'qa-dyna-charts.png':
      'SIMuSPACE quality assurance charts comparing LS-DYNA energy curves across four runs',
    'post-processing-workflow.png':
      'SIMuSPACE post-processing workflow, with one path for a failed and one for a successful simulation',
    'optimization-results.png':
      'SIMuSPACE optimisation results: the optimum found by differential evolution, its inputs and outputs, and the experiments behind it',
  },
});
