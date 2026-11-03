// @ts-check
import { project } from '../project.js';

//? Pictures: the owner's design exports, kept untouched in
//? originals/public/assets/career-buddy. The hero is the course catalogue,
//? framed on the page colour. The laptop screens are 1440 px frames widened
//? to the laptop's 16:10 with their own white; the lesson and the quiz are
//? taller than a screen, so they are cut at a gap between lines.
export default project({
  slug: 'career-buddy',
  title: 'Career Buddy',
  services: 'AI & Full Stack Development',
  credits: 'Team AlgoTracks',
  categories: ['development'],
  //? To confirm with the owner: where the client is (the docs do not say)
  location: 'Remote',
  //? The screens are dated December 2024
  year: '2024',
  //? A soft tint of the app's indigo (#5656f3), behind the laptop and the
  //? moving row. The framed hero has it too: make the hero again if it changes.
  background: '#d9d8f3',
  //? The owner's design (thumbnail.png, 1000x750), cut square around the
  //? laptop and phone without re-encoding
  thumbnail: 'thumbnail-square.jpg',
  description: {
    lead: 'Career Buddy is an AI e-learning platform: an AI tutor teaches every lesson in a chat, answers questions as they come up, then quizzes the student and awards a certificate.',
    body: [
      'A short starting quiz asks what the student wants to learn and suggests where to begin. Each module is taught by GPT models from OpenAI with custom instructions for that module, so every lesson stays on topic and is personalised to the student. After a lesson the AI writes a quiz, marks it and explains every wrong answer, and a student who does not pass is offered the lesson again.',
      'I worked on it as a full stack developer, with Next.js, Node.js, Express, MongoDB and the OpenAI API. MongoDB keeps the courses, quiz results and certificates, so the platform can grow with new courses and students, and every page works on desktop, tablet and phone.',
    ],
    built: [
      'Starting quiz, after which the AI suggests courses',
      'Course catalogue with search and level filters',
      'AI lessons for every module, from GPT with custom instructions',
      'Chat with the AI tutor about the lesson, in real time',
      'AI quizzes that explain every wrong answer',
      'Progress for every module and lesson, and certificates',
      'Subscription plans and payment methods',
    ],
  },
  hero: {
    'hero.webp':
      'Career Buddy course catalogue: Project Management courses filtered by level, each with its rating',
  },
  //? In the order a student meets them: the starting quiz first (held
  //? longest), then a course, a lesson, its quiz and the payment. Pictures
  //? two to five also drift past in the row under the laptop.
  laptop: {
    'starting-quiz.png':
      'Career Buddy starting quiz: the AI asks the student about their goal, offers courses and asks a first question',
    'course-modules.png':
      'Career Buddy course page: what the course teaches, its modules and the progress in each',
    'lesson.png':
      'Career Buddy lesson: the AI tutor teaches the module in a chat and answers a question, next to the course progress',
    'lesson-quiz.png':
      'Career Buddy quiz after a lesson: the AI marks each answer right or wrong',
    'payment.png':
      'Career Buddy payment methods for a subscription: PayPal, Google Pay, Apple Pay or a card',
  },
});
