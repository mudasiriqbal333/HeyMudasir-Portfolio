//? Tailwind loads this file through its own transpiler. Keep './app/_lib' as
//? the first import: a plugin imported above it reaches Tailwind as an empty
//? object and is silently not applied.
import { tailwindPlugin } from './app/_lib';

/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  //? hover: styles only on devices that can hover, so taps do not stick
  future: { hoverOnlyWhenSupported: true },
  content: ['./app/**/*.{js,jsx,mdx}'],
  plugins: [tailwindPlugin],
};

module.exports = tailwindConfig;
