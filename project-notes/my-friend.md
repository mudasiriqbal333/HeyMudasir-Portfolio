# My Friend

Slug `my-friend` · 10 files in `public/assets/my-friend/`, served at `/assets/my-friend/<file>`.
Every picture and clip is cut from the owner's two screen recordings of the app, at the moments the owner chose:
`first-conversation.mp4` (6:10) and `second-conversation.mp4` (4:40), 1920x1080 at 60 fps, kept whole in
`originals/public/assets/my-friend/` and also on Cloudinary (`v1723721922/first_convo_jjt8wj`, `v1723722104/second_convo_tohswc`).

| file | size | used for | from |
|---|---|---|---|
| hero.webp | 1900x906 | hero | first recording at 5:27, the app page as it is (no frame, as the owner asked) |
| laptop.mp4 | 1888x1180, 75 s | laptop | first recording, 0:04 to 1:19, no sound |
| laptop-poster.webp | 1888x1180 | laptop, until the clip plays | first recording at 0:04 |
| kano-1.mp4 | 1264x506, 5 s | moving row, first | first recording, 5:31 to 5:36, no sound |
| kano-1-poster.webp | 1264x506 | its first frame | first recording at 5:31 |
| kano-pose-1.webp | 1264x506 | moving row, second | first recording at 3:20 |
| kano-pose-2.webp | 1264x506 | moving row, third | first recording at 3:08 |
| kano-2.mp4 | 1264x506, 4 s | moving row, fourth | second recording, 3:02 to 3:06, no sound |
| kano-2-poster.webp | 1264x506 | its first frame | second recording at 3:02 |
| thumbnail.webp | 2400x2400 | previews | the owner's design `thumbnail.png`, saved as WebP at 98% (2.1 MB down to 374 kB) |

Only the app page is kept: rows 100 to 1005 of the recording, without Chrome's
tab and address bars, the black band below and the scrollbar. The conversation
page scrolls up by 29 or 43 px at times, which hides the top of the logo and the
menu button; there the hidden rows (and the frame's first 14 rows, which carry
compression noise from the bar) come from 0:10, when the page sat at the top,
with its right side moved 21 px for Chrome's scrollbar (`make3.py` recipe). The moving row
keeps only the 3D scene, cut 19 px inside its rounded corners. Nothing is
scaled. Stills come from lossless frames and are WebP at 98%; clips are
re-encoded with x264 (CRF 16 to 17, slow preset, 60 fps), which matches the
recording at 49 to 51 dB PSNR. The laptop clip is wider than 16:10, so the
page's own empty foot is continued below it. The thumbnail is the owner's own
design; the Cloudinary image `v1720891348/MyFriendAnimation.png` is no longer used.

`01.png` to `04.png`, pulled out of the Word document, are not used any more
and are kept in `originals/public/assets/my-friend/`.

## From PORTFOLIO PROJECTS.docx


### My Friend


### My Friend | OpenAI, ReactJS, NodeJS, ExpressJS, DynamoDB, Postgres

Role: Key contributor specializing in AWS service integration and real-time communication.

Technologies: AWS (S3, Transcribe, Polly, DynamoDB), WebSockets, Architectural Optimization.

Achievements:

Integrated various AWS services to enhance functionality and efficiency.

Implemented real-time communication using WebSockets.

Optimized architectural design to ensure a robust and scalable system.


### Project Overview:

My Friend is a voice assistant designed specifically for children to help them solve their problems.

First Interaction: The initial conversation focuses on getting to know each other. The child's responses are saved in a vector database to maintain context.

Problem-Solving: The voice assistant uses this context to guide and assist children in solving their problems.

Videos sent by mail


## From Moiz Project Portfolio.docx


### My Friend


### The Challenge:

The client sought to create an interactive, AI-powered voice assistant tailored specifically for children. The goal was to design a friendly and approachable system that could understand and assist children in solving various problems while maintaining a conversational and supportive tone. The main requirements were:

Personalization: The assistant needed to build a relationship with the child over time, maintaining a record of conversations to provide context in future interactions.

Real-Time Communication: The platform had to support real-time communication to ensure smooth, conversational exchanges between the child and the assistant.

Voice Interaction: The system needed to process spoken language, converting speech to text and generating lifelike speech responses using AWS services.

Scalability and Efficiency: The platform had to be scalable, able to handle a growing number of users, while also optimising AWS service costs and system performance.

The challenge was to integrate multiple AWS services and design a robust architecture capable of meeting these demands while ensuring the system remained friendly, safe, and engaging for children.


### The Solution:

To meet these objectives, I contributed to developing My Friend, an AI-powered voice assistant, using OpenAI, ReactJS, NodeJS, ExpressJS, AWS, and Postgres. We focused on integrating AWS services and implementing real-time communication to enhance the system's performance and user experience.

AWS Service Integration

Utilised AWS Transcribe for speech-to-text conversion, allowing the system to accurately understand children's spoken words.

Integrated AWS Polly to generate natural-sounding voice responses, making interactions more engaging and accessible for young users.

Used DynamoDB and Postgres for managing both session data and longer-term contextual information. Children's responses were saved in a vector database, maintaining conversation continuity and enabling personalised interactions over time.

Real-Time Communication

Implemented WebSockets for real-time interactions between children and the voice assistant, ensuring seamless communication without delays.

Built a system that supports real-time guidance, helping children through problems in an interactive and dynamic way.

3D Cartoon-Like Character

Created an engaging 3D character, similar to Talking Tom, using Three.js and React Three Fiber. This interactive character speaks and listens like a cartoon, adding a visual, fun element to the platform. The character reacts to the child’s voice inputs, animating and speaking back in real time, making the entire experience more immersive and enjoyable for children.

Architectural Optimization

Optimised the platform's architecture for scalability and efficiency, ensuring smooth performance as the number of users grows.

Leveraged AWS S3 for secure storage of audio files and conversation data, minimising latency and improving the overall system reliability.


### The Result:

My Friend successfully met the client’s goals, creating a voice assistant that is friendly, interactive, and effective in helping children solve problems. Key outcomes included:

Personalised Interaction: The assistant builds on previous conversations, maintaining context through the vector database. This allows it to better understand each child and provide personalised guidance, making the system feel more like a trusted companion.

Enhanced Engagement: Through real-time communication powered by WebSockets, children could interact with the assistant naturally, increasing engagement and making problem-solving more interactive.

Accurate Voice Processing: The combination of AWS Transcribe and Polly provided highly accurate speech recognition and response generation, ensuring that children were understood clearly and received lifelike, friendly replies.

Scalability and Efficiency: The optimised architecture allowed the system to handle multiple concurrent users while maintaining high performance. AWS service integration ensured efficient storage and communication, making the platform cost-effective and scalable for future growth.

Safe and Friendly Environment: The voice assistant provided a safe and welcoming environment where children could express their concerns and receive guidance, contributing to their problem-solving abilities in an interactive and engaging manner.

By integrating advanced AI and AWS services, My Friend created a reliable, scalable, and personalised voice assistant for children, fostering engagement and problem-solving in a fun and accessible way.
