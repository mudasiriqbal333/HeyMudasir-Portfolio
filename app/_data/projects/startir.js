// @ts-check
import { project } from '../project.js';

//? Consultancy, not development: the owner helped the team with the initial
//? system design and architecture. Pictures: the owner's exports, kept
//? untouched in originals/public/assets/startir. The hero is the desktop
//? landing page without its flat side bands; the app's 750 px phone screens
//? are cut to one screen's height from the top, never scaled.
export default project({
  slug: 'startir',
  title: 'Startir AI',
  services: 'System Design Consultancy',
  credits: 'Team AlgoTracks',
  categories: ['consultancy'],
  //? Startir LLC; the app priced in dollars and taught American sports
  location: 'United States',
  //? To confirm with the owner: the designs date their vouchers 2024
  year: '2024',
  //? The domain now presents Startir LLC's AI consulting, not this app
  liveUrl: 'https://startir.ai/',
  //? The violet of the landing page's glow, behind the phone screens
  background: '#49327a',
  //? The owner's design (thumbnail.png, 1000x750 JPEG), cut square without
  //? re-encoding: the logo whole, the phone running off the right edge
  thumbnail: 'thumbnail.jpg',
  description: {
    lead: 'Startir AI is a learning platform for players serious about their sport: short courses written by AI, quizzes that mark themselves, and badges, prizes and discounts on gear to earn along the way.',
    body: [
      'An admin gives a course a name and a short description, and large language models from OpenAI build the rest: the modules, the lessons, the quizzes and the final assessment. Players work through the modules in order, each unlocking the next, get every quiz marked at once with feedback, and are rewarded with badges and vouchers as they pass.',
      'My part was consultancy, not development: at the start I worked through the initial system design and architecture with my teammates, who then built it with Next.js, FastAPI, MySQL and the OpenAI API.',
    ],
    builtLabel: 'The product',
    built: [
      'Courses written by AI from a name and a short description',
      'Modules and lessons that unlock one after another',
      'Adaptive quizzes, marked at once with feedback',
      'Badges, games and prizes, and discounts on gear',
      'Progress on every course, to pick up where you left off',
      'Separate sides for students and for admins',
      'A scalable backend with analytics',
    ],
  },
  hero: {
    'hero.webp':
      'Startir landing page: for those serious about their sport, advanced learning, discounts on gear, games and prizes, and badges to earn',
  },
  //? No desktop app, so a phone stands in for the laptop: a course as a
  //? player takes it, from the home screen to the results (held longest
  //? first). Pictures two to five also lead the moving row, followed by the
  //? admin's side: signing up and making a course.
  phone: {
    'home.webp':
      'Startir home: featured and newly added courses, each with its progress',
    'course-modules.png':
      'Startir course modules: lessons done, in progress and locked, then the quiz',
    'lesson.png': 'Startir lesson: the introduction to a course module',
    'quiz.png': 'Startir quiz question with four answers',
    'results.png':
      'Startir results: a top badge for passing with full marks, and a discount voucher',
  },
  screens: {
    'sign-up.png': 'Startir sign-up, with a student side and an admin side',
    'create-course.png':
      'Startir admin creating a course from a name and a short description',
    'course.webp':
      'Startir course page with its progress and a discount voucher',
  },
});
