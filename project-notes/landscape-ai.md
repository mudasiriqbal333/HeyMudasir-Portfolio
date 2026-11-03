# Landscape AI

Slug `landscape-ai` · 7 pictures in `public/assets/landscape-ai/`, served at `/assets/landscape-ai/<file>`.
Development: the owner built it full stack (Flask with Hugging Face models, React).
Location "Australia" is read from the screens (styles such as Modern Australian and Natives; the client ACE Landscapes): to confirm with the owner. Year 2024.

| file | pixels | used for | from |
|---|---|---|---|
| hero.webp | 2904x1634 | hero | `landing.png`, framed on the page colour #dde5d5 |
| upload-photo.webp | 2048x1280 | laptop, first (held longest) | `01.png`, with more of its own empty page at the foot |
| crop-area.webp | 2880x1800 | laptop 2 and moving row | `canvas.png`, cut to 16:10 under its content |
| styles.webp | 2880x1800 | laptop 3 and moving row | `styling-template.png`, cut the same way |
| generated-designs.webp | 2976x1860 | laptop 4 and moving row | `image-review.png`, cut under its results and widened with its own white |
| my-designs.webp | 1984x1240 | laptop 5 and moving row | `07.png`, widened with its own white before its scrollbar track |
| thumbnail.webp | 1200x1200 | previews | the before-and-after pair from `landing.png`, framed on the page colour |

All are WebP at 98%: the screens are mostly garden photos, 1 to 2 MB each as
PNG. Nothing inside a screen is redrawn or resampled.

Every file is kept in `originals/public/assets/landscape-ai/`. Not used:
`dashboard.png` (it still shows the Untitled UI template's placeholder
dashboard), `08.png` (a different design of the upload step), `02.png` and
`upload.png` (the empty upload step), `03.png` (a hover state of the crop step)
and `04.png` to `06.png` (smaller copies of the screens above).

## From PORTFOLIO PROJECTS.docx


### LandscapeAI: Provide an image and let AI transform your landscape.


## From Moiz Project Portfolio.docx


### LandscapeAI


### The Challenge:

The goal of LandscapeAI was to create a web application that allows users to upload an image and have the landscape in the image transformed using AI models. The challenges faced during development included:

AI Integration: The project required seamless integration of advanced AI models for image manipulation, leveraging Hugging Face models for real-time transformation.

Efficient Backend Processing: The system had to handle high-resolution image uploads and process transformations in the background efficiently, ensuring low latency and smooth user experience.

User-Friendly Interface: The web interface needed to be intuitive, making it easy for users to upload images, preview transformations, and download the final results.

Scalability: As a growing number of users would interact with the platform, the architecture needed to scale efficiently to manage large-scale image processing without performance degradation.


### The Solution:

To overcome these challenges, I developed LandscapeAI with a tech stack that included a Flask backend for AI integration and a React frontend for the user interface.

AI-Powered Image Transformation

Integrated Hugging Face models into the Flask backend to handle the landscape transformation of user-uploaded images. The AI models were fine-tuned to recognize landscape elements and apply stylistic changes while preserving image quality.

Flask Backend for Efficient Processing

The backend, built with Flask, manages image uploads, processes AI transformations, and serves the results back to the frontend. The system was optimised for handling high-resolution images, ensuring smooth processing even with large files.

Asynchronous task handling was implemented to ensure that image processing tasks did not block the main application, providing real-time feedback to users during processing.

Responsive UI

A responsive React frontend was developed to allow users to easily upload their images, preview the transformed results, and download the final image. The interface was designed to be intuitive and straightforward, catering to users with varying levels of technical knowledge.

Scalability and Performance Optimization

The Flask backend was designed to scale, with the potential to integrate cloud-based storage solutions for handling large volumes of image data.

Performance optimizations were implemented for both the AI transformation pipeline and the frontend image rendering to minimise delays and provide a seamless user experience.


### The Result:

LandscapeAI successfully delivered an intuitive, AI-powered platform for transforming landscape images. Key outcomes included:

Efficient AI Image Processing: Hugging Face models integrated into the backend allowed for high-quality, real-time image transformations, enabling users to visualise and modify their landscapes with ease.

Smooth User Experience: The React frontend, combined with the Flask backend, offered a responsive and user-friendly interface. Users could effortlessly upload, preview, and download their transformed images with minimal delays.

Scalable Solution: The system architecture ensured that the platform could scale to accommodate an increasing number of users without impacting performance, with the potential for future cloud-based expansions.

High User Satisfaction: The ability to transform landscapes in images using AI technology, coupled with a smooth, intuitive interface, resulted in positive user engagement and feedback.

LandscapeAI stands as a prime example of how AI can be leveraged to create creative and interactive applications, allowing users to reimagine their environments with the power of AI.
