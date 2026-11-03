// @ts-check
import { project } from '../project.js';

export default project({
  slug: 'jarvis',
  title: 'Jarvis',
  services: 'AI & Full Stack Development',
  credits: 'Team AlgoTracks',
  categories: ['development'],
  location: 'United States',
  year: '2024',
  //? No liveUrl: the Live site button stays hidden until one is set
  background: '#efe1d6',
  //? thumbnail.png cut square around the laptop and phone, for the square
  //? previews
  thumbnail: 'thumbnail-square.png',
  description: {
    lead: 'Jarvis is an AI lead tracking application: it runs SMS and email campaigns, talks to the leads who reply, and sorts every lead by how interested they are.',
    body: [
      'A team uploads its leads, writes the campaign message with AI from a short prompt, and Jarvis sends it by SMS or email. When a lead replies, the AI carries on the conversation, writes a summary of it and marks the lead as awaiting reply, in conversation, interested or not interested.',
      'Owners follow the totals for every campaign on the dashboard and run their team with users, roles and permissions. I worked on it as a full stack developer.',
    ],
    built: [
      'Dashboard of campaigns and leads by status',
      'Lead management with search, filters and bulk CSV upload',
      'SMS and email campaigns, with leads auto-added from Gmail',
      'AI-written SMS and email templates from a prompt',
      'AI conversations with leads, each with a summary and a status',
      'Users, roles and permissions',
    ],
  },
  hero: {
    '01.webp':
      'Jarvis welcome page: powering smarter sales and unlocking lead potential',
  },
  //? No recording: four screens that all share the laptop's 16:10 shape
  //? cross-fade by themselves
  laptop: {
    '02.png': 'Jarvis dashboard with campaign and lead totals by status',
    '03.png': 'Jarvis leads table with search, filters and bulk upload',
    '07.png':
      'Jarvis campaigns table with replies and interest counts per campaign',
    '10.png': 'Jarvis writing an SMS with AI from a prompt',
  },
  screens: {
    'message-box.png':
      'Jarvis conversation with a lead, with its AI summary and Interested status',
    '09.png':
      'Jarvis campaign setup: auto-add leads from Gmail and pick the SMS or email',
    '12.png': 'Jarvis roles table with the permissions of each role',
  },
  phones: {
    'mobile-dashboard.png': 'Jarvis dashboard on a phone',
    'mobile-leads.png': 'Jarvis leads on a phone',
    'mobile-add-email.png': 'Jarvis writing an email with AI on a phone',
  },
});
