# Career Buddy

Slug `career-buddy` · 7 pictures in `public/assets/career-buddy/`, served at `/assets/career-buddy/<file>`.
No live site. To confirm with the owner: the page says "Remote" and 2024 (the screens are dated December 2024); neither document names the client, its country or the year.

| file | pixels | used for | from |
|---|---|---|---|
| hero.webp | 1680x1264 | hero | `courses.png`, the course catalogue, at 1:1 on the page colour #d9d8f3, with rounded corners and a soft shadow (lossless WebP) |
| starting-quiz.png | 1638x1024 | laptop, first (held longest) | `starting-quiz.png` |
| course-modules.png | 1638x1024 | laptop 2 and moving row | `course-modules.png` |
| lesson.png | 1638x1024 | laptop 3 and moving row | `lesson.png` (1440x1759), cut at row 1024, between two lines of the AI's answer |
| lesson-quiz.png | 1638x1024 | laptop 4 and moving row | `lesson-quiz.png` (1440x1341), cut after the third answer of the third question |
| payment.png | 1402x876 | laptop 5 and moving row | `payment.png`, its dark window frame trimmed; it keeps its own colour profile (Display, close to P3) |
| thumbnail-square.jpg | 750x750 | previews | the owner's design `thumbnail.png` (JPEG data, 1000x750), cut square around the laptop and phone without re-encoding |

The owner's exports are 1440 px frames. They are trimmed (the transparent export
margins of courses, course-modules and starting-quiz, the frame lines of payment)
and widened to the laptop's 16:10 by repeating their own white edge, so the laptop
shows no black bars and the logo stays in place as the screens cross-fade. Nothing
inside a screen is redrawn or resampled. The page colour #d9d8f3 is a soft tint of
the app's indigo #5656f3; the framed hero has it baked in, so make the hero again
if `background` changes.

The untouched exports are kept in `originals/public/assets/career-buddy/`. Not used:
`profile.png` (a plain form), `payment-gateway.png` (a blue outline runs round its
edge) and `subscriptions.png` (a design tool's selection box is drawn over the $100
plan). `01.png` to `05.png`, pulled out of the Word document, were byte-identical
copies of five of the named exports and were removed.

The catalogue and the course page repeat the same three courses down the grid:
seed data inside the design, not duplicate files.

## From Moiz Project Portfolio.docx


### Career Buddy


### The Challenge:

The client approached with a vision to create a dynamic and interactive e-learning platform that leverages artificial intelligence. Their main goal was to offer personalised learning experiences where students could interact with AI to ask questions and receive real-time responses. They wanted the platform to:

Provide tailored learning experiences for various courses.

Include an AI-powered quiz system that assesses student knowledge and offers explanations for incorrect answers.

Facilitate earning certifications based on student performance, motivating continuous learning.

Ensure the platform is scalable to handle multiple courses and a growing user base.

The challenge was to develop an efficient, AI-driven solution that could provide a personalised experience for each student while being easy to manage and scalable as the platform grew.


### The Solution:


### AI-Powered E-Learning Platform

To address these challenges, We developed Career Buddy, a web application powered by AI and built using Next.js, Node.js, Express, MongoDB, and OpenAI. The solution was crafted to deliver an interactive and personalised learning journey.

AI-Powered Course Delivery

Each course on the platform was integrated with OpenAI’s GPT models, which were specifically trained using customised instructions and prompts. This allowed the AI to deliver personalised lessons for each module, effectively guiding students through their learning paths.

Interactive Chat Interface

Students could ask questions related to the course material via a chat interface, and OpenAI responded with context-specific answers. This real-time interactivity enhanced engagement and created an immersive learning environment.

AI-Driven Quiz System

After completing modules, students took quizzes designed by the AI. The AI not only assessed their performance but also provided immediate feedback with explanations for incorrect answers, helping students understand and improve.

Certification Mechanism

Upon successful completion of modules and quizzes, students earned certificates. This served as both a reward and motivation to complete courses, adding a tangible outcome to their efforts.

Responsive Design

To ensure accessibility across devices, the platform was designed with full responsiveness. Using flexible layouts and adaptive design techniques, the user experience remains consistent whether accessed via desktop, tablet, or mobile. This design decision helped reach a broader audience, ensuring students can learn on the go.

Scalability and Flexibility

The platform was designed with scalability in mind. Using MongoDB to store course data, quiz results, and certifications ensured that the platform could handle a growing number of students and courses without compromising performance.


### The Result:

Career Buddy successfully transformed the client’s idea into a highly interactive and scalable e-learning platform. The results were both impactful and measurable:

Enhanced Student Learning: The AI-powered instruction and personalised feedback allowed students to engage with the material in a way that traditional e-learning platforms could not. Students could learn at their own pace, ask questions in real time, and receive immediate support from the AI.

Improved Engagement: The chat interface encouraged students to ask questions and explore the material further, leading to a more engaging learning experience. The AI’s ability to adapt to individual learning styles kept students more involved.

Efficient Knowledge Assessment: The quiz system provided instant feedback, helping students quickly identify areas for improvement and understand the reasoning behind correct answers. This real-time feedback loop significantly boosted student comprehension.

High User Satisfaction: The combination of AI-powered learning and the ability to earn certificates increased user satisfaction and retention. Students felt motivated to complete courses, knowing they would receive recognition for their efforts.

Scalability and Future Growth: The flexible, scalable architecture enabled the platform to grow as more courses and users were added, providing a solid foundation for future expansion.

Career Coach is now positioned as a forward-thinking educational tool, leveraging AI to deliver personalised, high-quality learning experiences.
