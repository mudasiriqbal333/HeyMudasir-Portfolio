// @ts-check
import { project, video } from '../project.js';

export default project({
  slug: 'rehq',
  title: 'REHQ',
  services: 'React & Node.js Development',
  credits: 'Team REHQ',
  categories: ['development'],
  location: 'Florida, US',
  year: '2025 – Present',
  liveUrl: 'https://www.getrehq.com/',
  background: '#c6d8d4',
  thumbnail: 'thumbnail1.jpg',
  description: {
    lead: 'REHQ is a prospecting and deal management platform for commercial real estate brokers and investors.',
    body: [
      'It puts owner records for more than 160 million US properties on one map, then lets a broker call, email, text or mail those owners and follow every deal through a shared pipeline.',
      'I joined its product team in August 2025 as a React developer, working with designers, back end developers and QA in an Agile team, and I also build Node.js APIs and MongoDB data models for its core features.',
    ],
    //? The owner's own work, from their CV (REHQ under Experience and Projects)
    built: [
      'Twilio call recording, transcription and AI call summaries',
      'A WhatsApp-style transcript view, with one-click tasks from each summary',
      'Record merging and duplicate handling, with field-level conflict resolution',
      'The CSV import overhaul: mapping warnings, validation and error handling',
      'Fewer API calls on app load, by caching reference data',
      'Node.js APIs with authentication and role-based access',
    ],
  },
  hero: {
    'dashboard.png':
      'REHQ dashboard with the deal pipeline, leads, prospecting activity and tasks',
  },
  //? Sign-in page: the map zooms from the US into Florida parcels and
  //? loops seamlessly every 14 seconds
  laptop: video(
    'sign-in.mp4',
    'sign-in-poster.jpg',
    'REHQ sign-in page, with a map zooming from the US into Florida land parcels',
  ),
  screens: {
    'power-dialer.png':
      'REHQ power dialer mid-call, with the property, notes and call queue',
    'sequences.png':
      'REHQ sequence with email and SMS steps and its recipients',
    'map.webp': 'REHQ property map with parcel outlines and owner details',
    'properties.png': 'REHQ properties table with contacts, activity and tags',
  },
  phones: {
    'mobile-dashboard.png': 'REHQ mobile dashboard',
    'mobile-deals.png': 'REHQ mobile deals pipeline',
    'mobile-map-property.png': 'REHQ mobile map with a property selected',
  },
});
