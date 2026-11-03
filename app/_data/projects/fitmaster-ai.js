// @ts-check
import { project, video } from '../project.js';

//? Media: the team's demo video (demo.mp4, 1450x720, 2:26, as posted on
//? LinkedIn by Raahim Shah on 2025-03-13, kept as it is; it plays muted in
//? the laptop). Every picture is a frame of it: the poster is its first
//? frame, the hero the progress dashboard at 2:22, the screenshots the food
//? tracking at 2:06 and the workout plan at 1:45. The thumbnail puts the
//? dashboard's cards in a laptop on the app's navy.
//? Text: the owner's CV ("AI-Powered Fitness Assistant - FitMaster AI,
//? Final Year Project") and the team's LinkedIn post.
export default project({
  slug: 'fitmaster-ai',
  title: 'FitMaster AI',
  tagline: 'Final Year Project, NUST',
  services: 'AI & Full Stack Development',
  credits: 'Team FitMaster AI',
  categories: ['development'],
  location: 'Islamabad, Pakistan',
  //? The final year of the degree (2021 – 2025); the demo is from March 2025
  year: '2024 – 2025',
  //? The navy of the app's own pages
  background: '#101828',
  thumbnail: 'thumbnail.webp',
  description: {
    lead: 'FitMaster AI is an AI fitness companion that makes expert workout and nutrition guidance affordable: it writes your workout and diet plans, recognises food from a photo to count your calories, and tracks your progress.',
    body: [
      'I led it as our final year project at NUST, in a team of four with Raahim Shah, Haroon Jawad and Awais Nadeem. It is made for beginners who cannot afford a personal trainer, and as a safe alternative for women who prefer not to train with a male coach.',
      'The front end is Next.js and TypeScript with Tailwind CSS, shadcn/ui and Chart.js, on Firebase for sign-in and data. An OpenAI chatbot gives fitness advice and writes the plans, a YOLO model behind a FastAPI service recognises the food in a photo, and real-time posture detection with MediaPipe and TensorFlow corrects your form as you train.',
    ],
    built: [
      'Workout and diet plans written by an OpenAI chatbot',
      'Food recognition from a photo with a YOLO model, for calorie tracking',
      'Real-time posture detection with MediaPipe and TensorFlow',
      'Progress dashboard with Chart.js',
      'Next.js, TypeScript, Tailwind CSS and shadcn/ui on Firebase',
      'FastAPI back end for the AI predictions',
    ],
  },
  hero: {
    'hero.webp':
      'FitMaster AI progress dashboard: daily calories, weight over time, weekly exercise and exercise form accuracy',
  },
  //? The whole demo: landing page, sign-up and sign-in, the AI chat writing
  //? a plan, the weekly workout plan, food tracking and the dashboard
  laptop: video(
    'demo.mp4',
    'demo-poster.webp',
    'FitMaster AI demo: from the landing page through sign-in, the AI chat, the weekly workout plan and food tracking to the progress dashboard',
  ),
  screens: {
    'food-tracking.webp':
      'FitMaster AI food tracking: a photo of a meal recognised as fried rice, ice cream and samosas, with its calories, protein, carbs and fats',
    'workout-plan.webp':
      'FitMaster AI weekly workout plan, with sets and reps for each day',
  },
});
