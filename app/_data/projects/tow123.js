// @ts-check
import { project } from '../project.js';

export default project({
  slug: 'tow123',
  title: 'TOW123',
  services: 'Full Stack Development',
  credits: 'Team Agencybox',
  categories: ['development'],
  location: 'United States',
  year: '2024',
  //? It never launched, so there is no liveUrl and no Live site button
  background: '#d3dedf',
  //? 1000x750, not square, on purpose (see wideThumbnails in validate-cases.js)
  thumbnail: 'thumbnail.jpg',
  description: {
    lead: 'TOW123 is an on-demand car service platform, like Uber for roadside help: a driver asks for a tow, fuel, a jump start, a tire change or a lockout, and the nearest provider takes the job.',
    body: [
      'It is two apps on one backend. Vehicle owners use the customer app to request a service, pay and follow their driver on the map. Providers run their companies from the provider panel: managers add drivers and dispatchers across locations, dispatchers assign incoming requests, and drivers deliver the service.',
      'I built it full stack with React, React Native, Node.js, Express and MongoDB, with Redis caching the location queries behind the real-time matching.',
    ],
    built: [
      'Live location tracking of drivers and customers during a job',
      'Real-time matching of each request to the nearest available provider',
      'Provider management: companies, locations, managers, dispatchers and drivers',
      'Dispatching board with orders from waiting to completed',
      'Service request flow: location, car details, secured rate and payment',
      'Provider reports on orders, revenue, trucks and drivers',
      'Redis caching for geolocation queries and provider availability',
    ],
  },
  hero: {
    'home.png':
      'TOW123 home page: get help now with a tow, jump start or fuel delivery',
  },
  //? No recording of this one: the provider panel screens change on their
  //? own every few seconds instead, each shown whole on black
  laptop: {
    //? dashboard.png with 13px trimmed off the bottom
    'dashboard-laptop.png':
      'TOW123 provider panel reports: orders, revenue, trucks and drivers',
    'order-tracking.webp':
      'TOW123 service tracking page with the route on a map',
    //? service.png with its bottom trimmed to just under the second row's
    //? buttons, so it all but fills the laptop screen
    'service-laptop.png':
      'TOW123 roadside services: tow, battery, impound, winch, fuel, tire and lockout',
  },
  screens: {
    'drivers.webp':
      'TOW123 provider panel map with the live location of every truck',
    'dispatch.png': 'TOW123 provider panel dispatching board',
    'payment.png':
      'TOW123 payment step with the rate secured for a few minutes',
  },
  phones: {
    'mobile-home.png': 'TOW123 customer app home screen',
    'mobile-dispatching.png': 'TOW123 provider panel dispatching on a phone',
    '05.png': 'TOW123 driver app navigating to a pickup',
  },
});
