// @ts-check
import { project } from '../project.js';

//? Pictures: the owner's screens, kept untouched in
//? originals/public/assets/landscape-ai. The hero is the landing page framed
//? on the page colour. Most screens are taller than the laptop's 16:10 and
//? are cut to it under their content; the results screen and the gallery are
//? widened with their own background instead (the layout is left-aligned).
//? WebP at 98%: they are mostly garden photos, 1 to 2 MB each as PNG.
export default project({
  slug: 'landscape-ai',
  title: 'Landscape AI',
  services: 'AI & Full Stack Development',
  credits: 'Team AlgoTracks',
  categories: ['development'],
  //? To confirm with the owner: the client designs Australian gardens
  //? (ACE Landscapes; styles such as Modern Australian and Natives)
  location: 'Australia',
  year: '2024',
  //? A soft sage for gardens, next to the app's green
  background: '#dde5d5',
  //? The before-and-after pair from the landing page, framed
  thumbnail: 'thumbnail.webp',
  description: {
    lead: 'Landscape AI redesigns a backyard from a single photo: upload a picture of the yard, mark the part to change, pick a style, and AI draws new landscape designs in seconds.',
    body: [
      'It is made for landscapers and their clients, with styles such as Modern Australian, Tropical, Natives and Japanese, a setting for how creative the AI may be, and custom instructions for anything else. Every design can be saved, exported, used as the next starting point, or rated to feed back into the model.',
      'I built it full stack: a Flask back end that runs Hugging Face models on the uploaded images, with asynchronous processing so large photos never hold the app up, and a React front end for uploading, cropping, styling and reviewing the results.',
    ],
    built: [
      'AI redesign of a yard from one photo, with Hugging Face models',
      'Upload, crop and mark the area to redesign',
      'Style presets, AI creativity level and custom instructions',
      'Several designs per run, each with feedback for the model',
      'A gallery of saved designs to export or reuse',
      'Asynchronous processing of high-resolution images',
      'Flask back end and React front end',
    ],
  },
  hero: {
    'hero.webp':
      'Landscape AI landing page: transform your yard with custom AI landscape designs, with a before and after photo of a backyard',
  },
  //? The steps in order, from the photo to the saved designs. Pictures two to
  //? five also lead the moving row.
  laptop: {
    'upload-photo.webp':
      'Landscape AI first step: a photo of the yard, uploaded',
    'crop-area.webp':
      'Landscape AI marking the lawn to redesign, in blue over the photo',
    'styles.webp':
      'Landscape AI style presets, AI creativity level and custom instructions',
    'generated-designs.webp':
      'Landscape AI generated garden designs, each to save, export or rate',
    'my-designs.webp':
      'Landscape AI gallery of saved designs, each to view, export, reuse or delete',
  },
});
