// @ts-check
import { project, video } from '../project.js';

export default project({
  slug: 'rehq',
  title: 'REHQ',
  services: 'Full Stack Developer',
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
      'I have worked on it for the past year as a full stack developer in the product team, mostly on the front end.',
    ],
    built: [
      'Onboarding flow',
      'Power dialer for calling through owner lists',
      'Prospecting',
      'Email and SMS sequences',
      'Email deliverability',
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
