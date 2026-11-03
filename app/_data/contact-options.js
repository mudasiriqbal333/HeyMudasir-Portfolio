//? The owner's contact details, the contact page copy and the footer's.
export const contactOptions = {
  //? Footer heading on every page ("Let's work together")
  heading: ['Let’s work', 'together'],
  //? Contact page hero heading
  pageHeading: ["Let's start", 'working together'],
  //? Round picture beside "Let's work together" in the footer on every page
  //? and beside "Let's start working together" on the Contact page.
  //? A 640px square crop of public/mudasir.png on the head and shoulders,
  //? small enough for every page load.
  profilePicture: {
    src: '/mudasir-avatar.webp',
    alt: 'Mudasir Iqbal profile picture',
  },
  form: {
    fields: [
      {
        number: '01',
        name: 'name',
        label: "What's your name?",
        placeholder: 'John Doe *',
        type: 'text',
        required: true,
        autoComplete: 'name',
      },
      {
        number: '02',
        name: 'email',
        label: "What's your email?",
        placeholder: 'john@doe.com *',
        type: 'email',
        required: true,
        autoComplete: 'email',
      },
      {
        number: '03',
        name: 'company',
        label: "What's the name of your organization?",
        placeholder: 'John & Doe ®',
        type: 'text',
        autoComplete: 'organization',
      },
      {
        number: '04',
        name: 'service',
        label: 'What services are you looking for?',
        placeholder: 'Web development, AI features ...',
        type: 'text',
        autoComplete: 'off',
      },
      {
        number: '05',
        name: 'message',
        label: 'Your message',
        placeholder: 'Hello Mudasir, can you help me with ... *',
        type: 'textarea',
        rows: 8,
        required: true,
        autoComplete: 'off',
      },
    ],
    submitLabel: 'Send it!',
    successMessage: 'Thank you! Your message has been sent.',
    failureMessage: 'Something went wrong. Please try again or email me.',
  },
  contactDetails: [
    {
      href: 'mailto:mudasiriqbalmcs@gmail.com',
      title: 'mudasiriqbalmcs@gmail.com',
    },
    //? Shown beside the email in the footer and under it on the Contact page
    { href: 'tel:+923185558825', title: '+92 318 5558825' },
  ],
  //? "Book a call" on the contact page: the owner's Google Calendar booking
  //? page (Google Calendar -> Booking pages -> the schedule -> Share).
  //? Switched off (it was the previous owner's calendar); while it is
  //? commented out the contact page hides the button.
  // booking: {
  //   label: 'Book a call',
  //   href: 'https://calendar.app.google/Yu3ZKdPfagLcWMgA7',
  // },
  businessDetails: [
    'Mudasir Iqbal',
    'Senior Software Engineer',
    'Location: Pakistan',
  ],
  //? Footer call to action
  cta: { href: '/contact', label: 'Get in touch' },
  version: '2026 © Edition',
  //? IANA time zone shown in the footer clock
  timeZone: 'Asia/Karachi',
};
