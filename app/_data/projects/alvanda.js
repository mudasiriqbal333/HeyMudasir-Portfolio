// @ts-check
import { project } from '../project.js';

//? Consultancy, not development: the owner helped the team with the initial
//? system design and architecture. Pictures: the owner's 2880 px screenshots
//? (16:9, Display P3), kept untouched with the Word document's extracts in
//? originals/public/assets/alvanda. For the laptop's 16:10 each gets more of
//? its own empty page above the help button; the task dialog loses part of
//? its blurred right edge instead.
export default project({
  slug: 'alvanda',
  title: 'Alvanda',
  services: 'System Design Consultancy',
  credits: 'Team AlgoTracks',
  categories: ['consultancy'],
  //? Alvanda Inc., Wilmington, Delaware (from its imprint)
  location: 'United States',
  //? The screenshots, and the dates inside them, are from early 2024
  year: '2024',
  //? The indigo of Alvanda's own banner, so the hero and the laptop match
  background: '#2f30ab',
  //? The banner cut square, with its own indigo added above and below
  thumbnail: 'thumbnail.webp',
  description: {
    lead: 'Alvanda is a B2B platform for running a company by its procedures: the organisation chart, step-by-step procedures drawn as flowcharts, and the tasks that follow them.',
    body: [
      'A company sets up its departments, positions and people, then writes down how its work is done as procedures built from reusable steps and components. Any task can carry a procedure, so whoever picks it up follows the same steps, and overdue work escalates to their manager.',
      'My part was consultancy, not development: at the start I worked through the initial system design and architecture with my teammates, who then built the product.',
    ],
    builtLabel: 'The product',
    built: [
      'Company setup with departments, positions and people',
      'An organisation chart to change in a few clicks',
      'Procedures drawn as flowcharts from reusable steps',
      'Components that make every step trackable',
      'Tasks that carry a procedure and a due date',
      'Escalation of overdue tasks to managers',
      'Member pages with the tasks of each person',
    ],
  },
  hero: {
    'hero.webp':
      'Alvanda logo over a laptop showing the procedure builder, with the share and edit procedure dialogs',
  },
  //? From a procedure to the people who follow it. Pictures two to five also
  //? lead the moving row.
  laptop: {
    'procedure-preview.png':
      'Alvanda procedure preview: a call-handling procedure drawn as a flowchart of steps',
    'component-builder.png':
      'Alvanda component builder: the fields a step collects and the statuses it can be in',
    'create-task.png':
      'Alvanda creating a task with an assignee, a procedure to follow and a due date',
    'org-chart.png':
      'Alvanda organisation chart: departments and positions under the chairman',
    'company.png':
      'Alvanda company page with its details, a summary of its organisation chart and its colleagues',
  },
  screens: {
    'procedures.png':
      'Alvanda procedures, filtered by department and position, each with its time and steps',
    'company-settings.png':
      'Alvanda company administration with the escalation settings for overdue tasks',
  },
});
