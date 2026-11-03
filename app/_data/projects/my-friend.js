// @ts-check
import { project, video } from '../project.js';

//? Every picture and clip is cut from the owner's two screen recordings of the
//? app (1920x1080, 60 fps; both kept whole in originals/public/assets/
//? my-friend), at the moments the owner chose, never scaled: only the app
//? page, without Chrome's bars, and for the moving row only the 3D scene.
//? Where the page had scrolled under Chrome's bar, its hidden top (logo and
//? menu button) is put back from a moment it was at the top. Clips are
//? re-encoded near-losslessly and carry no sound.
export default project({
  slug: 'my-friend',
  title: 'My Friend',
  services: 'AI & Full Stack Development',
  credits: 'Team Clustox',
  categories: ['development'],
  location: 'United Kingdom',
  year: '2023',
  background: '#c0cac9',
  //? The owner's design (thumbnail.png, 2400x2400, kept in originals),
  //? saved as WebP at 98%: 2.1 MB down to 374 kB with no visible change
  thumbnail: 'thumbnail.webp',
  description: {
    lead: 'My Friend is a voice assistant for children: Kano, a friendly 3D super-hero bear, talks with a child, gets to know them, and then helps them work through their problems.',
    body: [
      "The first conversation is about getting to know each other, and the child's answers are kept in a vector database, so every later talk builds on what Kano already knows. The child simply speaks: AWS Transcribe turns the speech into text, OpenAI shapes the reply, and AWS Polly says it back in a natural voice, while Kano listens, talks and animates in real time, a little like Talking Tom.",
      'I was a key contributor, focused on the AWS integration and the real-time communication: WebSockets for the live conversation, S3 for the audio, DynamoDB and Postgres for sessions and long-term context, and an architecture tuned to stay fast and affordable as more children use it. Kano himself is drawn with Three.js and React Three Fiber.',
    ],
    built: [
      'AWS Transcribe for speech to text, AWS Polly for a natural voice',
      'Real-time conversation over WebSockets',
      'Memory of every child in a vector database',
      'Sessions and context in DynamoDB and Postgres, audio in S3',
      'An architecture optimised to stay robust and scalable',
      'A 3D character that listens, talks and animates in real time',
    ],
  },
  //? 5:27 of the first recording, as it is (the owner wants no frame here)
  hero: {
    'hero.webp':
      'My Friend conversation: Kano, the 3D super-hero bear, and his puppy Jacko in their spaceport, with what Kano says written below',
  },
  //? 0:04 to 1:19 of the first recording: from the welcome page into the
  //? first conversation. The page's own empty foot is continued to 16:10.
  laptop: video(
    'laptop.mp4',
    'laptop-poster.webp',
    'My Friend from its welcome page into a first conversation, where Kano introduces himself and his world',
  ),
  //? The animation, drifting past: 5:31 to 5:36 and stills at 3:20 and 3:08
  //? of the first recording, then 3:02 to 3:06 of the second
  screens: [
    {
      ...video(
        'kano-1.mp4',
        'kano-1-poster.webp',
        'Kano moving as he talks, with Jacko by the spaceport',
      ),
      width: 1264,
      height: 506,
    },
    {
      type: 'image',
      src: 'kano-pose-1.webp',
      alt: 'Kano standing on the grass in front of the spaceport, with Jacko',
    },
    {
      type: 'image',
      src: 'kano-pose-2.webp',
      alt: 'Kano spreading his arms as he talks',
    },
    {
      ...video(
        'kano-2.mp4',
        'kano-2-poster.webp',
        'Kano moving during an open conversation',
      ),
      width: 1264,
      height: 506,
    },
  ],
});
