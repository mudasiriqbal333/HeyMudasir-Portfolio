// @ts-check
/**
 * Helpers the project files share: pictures and videos hosted on Cloudinary,
 * and the grey stand-ins a project uses until its screenshots are ready.
 *
 * @typedef {import('./case-options.js').CaseMedia} Media
 * @typedef {import('./case-options.js').CaseBlock} Block
 */

//? The Cloudinary account the remote pictures and videos live in. The name is
//? not a secret: it is part of every picture address. The variable can still
//? point the site at another account; where it was never set, the site's own
//? account is used instead of producing ".../undefined/..." addresses.
const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dqbj2ip7c';

/**
 * A Cloudinary picture by public id, e.g. 'v1720891348/MyFriendAnimation.png'.
 * @param {string} id
 */
export const cloudinary = id =>
  `https://res.cloudinary.com/${cloud}/image/upload/${id}`;

/**
 * A Cloudinary video by public id (any upload format, e.g. .mkv): delivered
 * as mp4, with its first frame as the poster.
 * @param {string} id public id without extension, e.g. 'v1723721922/first_convo_jjt8wj'
 * @param {string} alt
 * @returns {Media}
 */
export const cloudinaryVideo = (id, alt) => ({
  type: 'video',
  src: `https://res.cloudinary.com/${cloud}/video/upload/q_auto/${id}.mp4`,
  poster: `https://res.cloudinary.com/${cloud}/video/upload/so_0,q_auto/${id}.jpg`,
  alt,
  controls: true,
});

/** @param {string} text */
const escapeXml = text =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Neutral placeholder image with a label, as an inline SVG.
 * @param {string} label
 * @param {number} width
 * @param {number} height
 * @param {string} [fill]
 */
export const placeholder = (label, width, height, fill = '#d4d9d9') =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'><rect width='100%' height='100%' fill='${fill}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Helvetica, Arial, sans-serif' font-size='${Math.round(width / 26)}' fill='#1c1d20' fill-opacity='0.35'>${escapeXml(label)}</text></svg>`,
  )}`;

/**
 * A placeholder as a picture for a block; the label is also its alt text.
 * @param {string} label
 * @param {number} width
 * @param {number} height
 * @param {string} [fill]
 * @returns {Media}
 */
export const image = (label, width, height, fill) => ({
  type: 'image',
  src: placeholder(label, width, height, fill),
  alt: label,
});

/**
 * The standard block set used by every seeded case (swap freely).
 * @param {string} title
 * @returns {Block[]}
 */
export const defaultBlocks = title => [
  { type: 'device', media: image(`${title} · desktop screen`, 1600, 1000) },
  {
    type: 'plain',
    paddingBottom: true,
    media: image(`${title} · detail`, 1600, 1000, '#c9cfcf'),
  },
  {
    type: 'fullwidth',
    tint: 0.2,
    media: image(`${title} · full width`, 1920, 1270, '#3a3d42'),
  },
  { type: 'device', media: image(`${title} · desktop screen 2`, 1600, 1000) },
  {
    type: 'mobiles',
    media: [
      image(`${title} · phone 1`, 1080, 2191, '#f1f1ef'),
      image(`${title} · phone 2`, 1080, 2191, '#e9eaeb'),
      image(`${title} · phone 3`, 1080, 2191, '#1c1d20'),
    ],
  },
];
