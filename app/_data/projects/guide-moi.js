// @ts-check
import { project } from '../project.js';

//? Consultancy, not development: the owner helped the team with the initial
//? system design and architecture. A phone-only app, so a phone stands in
//? for the laptop. Pictures: the owner's phone screens, kept untouched in
//? originals/public/assets/guide-moi; each got a status-bar strip and the
//? phone's exact shape from blank rows only (see project-notes/guide-moi.md).
export default project({
  slug: 'guide-moi',
  title: 'Guide-Moi',
  services: 'System Design Consultancy',
  credits: 'Team AlgoTracks',
  categories: ['consultancy'],
  //? The app plans stays in Québec, in French, with prices in dollars (CAD)
  location: 'Québec, Canada',
  //? To confirm with the owner: the screens are dated January 2025
  year: '2025',
  //? A soft mint from the app's green (#14a475)
  background: '#d2ede4',
  //? The home screen's header and current trip, cut square at full
  //? resolution: the owner's thumbnail.png is an enlarged crop of this view
  thumbnail: 'thumbnail.png',
  description: {
    lead: 'Guide-Moi is a travel companion you chat with, in French: say where you are going and for how long, and it plans your stay in Québec, suggests what to see and do, and books what you need along the way.',
    body: [
      'A trip starts from a destination, dates or a number of days, who is travelling and a budget, typed or spoken. Guide-Moi checks the weather for the stay and asks what you like, from museums and festivals to hiking and spas. Then it guides you in a chat: an exhibition five minutes away, with the family price, or a taxi booked through TaxiCoop, with the fare to approve and the car to follow on a map.',
      'My part was consultancy, not development: at the start I worked through the initial system design and architecture with my teammates, who then built the app.',
    ],
    builtLabel: 'The product',
    built: [
      'Trips planned from a destination, dates, travellers and budget',
      'Voice input as well as typing',
      'A weather forecast for every day of the stay',
      'Interests to choose, from museums to vineyards',
      'A chat guide that suggests places nearby, with prices',
      'Bookings from the chat, such as a taxi to follow on a map',
      'Every trip kept, to come back to or plan the next',
    ],
  },
  hero: {
    'welcome.png':
      'Guide-Moi welcome screen: discover Québec, and chat with Guide-Moi to plan your trips and find the best activities',
  },
  //? A trip from the home screen to a booking (the home screen stays up
  //? longest). Pictures two to five also lead the moving row.
  phone: {
    'home.png':
      'Guide-Moi home: good morning, the current trip to Québec and the trips before it',
    'trip-form.png':
      'Guide-Moi planning a five-day trip to Québec for two adults and two children',
    'interests.png':
      'Guide-Moi asking which activities you are looking for, from art and breweries to spas and vineyards',
    'suggestion.webp':
      'Guide-Moi suggesting an exhibition on gladiators at the Musée de la civilisation, five minutes away, with the family price',
    'taxi.webp':
      'Guide-Moi booking a taxi through TaxiCoop, with the fare to approve and the car to follow on a map',
  },
  screens: {
    'new-trip.png':
      'Guide-Moi starting a new trip: destination, dates or duration, adults and children',
    'voice-input.png': 'Guide-Moi taking the destination by voice',
    'weather.png':
      'Guide-Moi weather forecast for each day of the stay in Québec',
  },
});
