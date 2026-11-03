/**
 * Reads a picture's pixel size from the header of the file, with no image
 * library: PNG, JPEG, WebP and GIF. The size is the one a browser lays the
 * picture out with (naturalWidth and naturalHeight): the stored size, with
 * width and height swapped when a JPEG or a PNG says, in the orientation a
 * camera or phone writes, that it is stored on its side.
 *
 * Checked against Chrome on every picture under public/ and on a set of
 * made-up ones. Two things are left out on purpose:
 *   - a JPEG can also say, in its Exif resolution, that it is meant to be
 *     shown smaller than its pixels (a "2x" picture). Browsers then report
 *     the smaller size. The shape is the same, and the shape is all the
 *     pages use;
 *   - metadata in places no camera or image tool puts it (a JPEG's Exif
 *     segment after its frame header, a PNG chunk with a wrong checksum).
 *
 * @typedef {{format: 'png' | 'jpeg' | 'webp' | 'gif', width: number, height: number}} ImageSize
 */

/**
 * The bytes from `from` up to `to`, read as text.
 * @param {Uint8Array} bytes
 * @param {number} from
 * @param {number} to
 */
const ascii = (bytes, from, to) =>
  String.fromCharCode(...bytes.subarray(from, to));

/**
 * The orientation written in a TIFF block, which is what a JPEG's Exif
 * segment and a PNG's eXIf chunk hold: 1 to 8, and 1 (upright) when the
 * block says nothing a browser would read. Browsers take the first
 * orientation that is written as one 16-bit number from 1 to 8.
 * @param {DataView} view
 * @param {number} tiff where the block begins
 * @param {number} end where it stops
 */
function tiffOrientation(view, tiff, end) {
  if (tiff + 8 > end) return 1;

  //? "II" and 42 with the lowest byte first, or "MM" and 42 with the highest
  const order = view.getUint16(tiff);
  const little = order === 0x4949;
  if (!little && order !== 0x4d4d) return 1;
  if (view.getUint16(tiff + 2, little) !== 42) return 1;

  const list = tiff + view.getUint32(tiff + 4, little);
  if (list + 2 > end) return 1;

  const count = view.getUint16(list, little);
  for (let at = 0; at < count; at += 1) {
    //? Each field is 12 bytes: tag, type, how many, and the value
    const field = list + 2 + at * 12;
    if (field + 12 > end) return 1;

    const value = view.getUint16(field + 8, little);
    if (
      view.getUint16(field, little) === 0x0112 &&
      //? type 3 is a 16-bit number; there must be one of them
      view.getUint16(field + 2, little) === 3 &&
      view.getUint32(field + 4, little) === 1 &&
      value >= 1 &&
      value <= 8
    ) {
      return value;
    }
  }

  return 1;
}

/**
 * The size as a browser shows it: 5 to 8 mean a quarter turn, and the
 * picture then has its width and height swapped.
 * @param {ImageSize['format']} format
 * @param {number} width as stored
 * @param {number} height as stored
 * @param {number} orientation 1 to 8
 * @returns {ImageSize}
 */
function shown(format, width, height, orientation) {
  const turned = orientation >= 5;

  return {
    format,
    width: turned ? height : width,
    height: turned ? width : height,
  };
}

/**
 * PNG: an 8-byte signature, then a run of chunks, each a 32-bit length, a
 * four-letter name, the content and a 4-byte checksum. The first chunk,
 * IHDR, holds width and height as 32-bit numbers, highest byte first. An
 * eXIf chunk between it and the picture data (IDAT) may say the picture is
 * stored on its side; browsers read the first one only.
 * @param {Uint8Array} bytes
 * @param {DataView} view
 * @returns {ImageSize | null}
 */
function png(bytes, view) {
  if (bytes.length < 24 || ascii(bytes, 12, 16) !== 'IHDR') return null;

  let orientation = 1;
  //? The signature is 8 bytes and the IHDR chunk always 25
  let at = 33;

  while (at + 8 <= bytes.length) {
    const name = ascii(bytes, at + 4, at + 8);
    const end = at + 8 + view.getUint32(at);

    if (name === 'IDAT') break;
    if (name === 'eXIf') {
      if (end <= bytes.length) orientation = tiffOrientation(view, at + 8, end);
      break;
    }

    at = end + 4;
  }

  return shown('png', view.getUint32(16), view.getUint32(20), orientation);
}

/**
 * GIF: "GIF87a" or "GIF89a", then width and height as 16-bit numbers, lowest
 * byte first.
 * @param {Uint8Array} bytes
 * @param {DataView} view
 * @returns {ImageSize | null}
 */
function gif(bytes, view) {
  if (bytes.length < 10) return null;

  return {
    format: 'gif',
    width: view.getUint16(6, true),
    height: view.getUint16(8, true),
  };
}

/**
 * JPEG: a run of segments, each `ff`, a marker byte and (for most) a 16-bit
 * length. The size is in the "start of frame" segment; an Exif segment before
 * it may say the picture is stored on its side. Browsers read the first Exif
 * segment only.
 * @param {Uint8Array} bytes
 * @param {DataView} view
 * @returns {ImageSize | null}
 */
function jpeg(bytes, view) {
  /** @type {number | null} null until the first Exif segment is met */
  let orientation = null;
  let at = 2;

  while (at + 4 <= bytes.length) {
    if (bytes[at] !== 0xff) return null;

    const marker = bytes[at + 1];
    //? The picture data (da) or the end of the file (d9) came before any size
    if (marker === 0xd9 || marker === 0xda) return null;

    //? Padding, and the markers that stand alone with no length after them
    if (marker === 0xff) at += 1;
    else if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) at += 2;
    else {
      const length = view.getUint16(at + 2);
      const end = at + 2 + length;

      //? Start of frame: c0-cf, except c4, c8 and cc, which are tables
      const frame =
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc;

      if (frame) {
        if (at + 9 > bytes.length) return null;

        return shown(
          'jpeg',
          view.getUint16(at + 7),
          view.getUint16(at + 5),
          orientation ?? 1,
        );
      }

      //? "Exif", a zero byte and one more byte that browsers do not look
      //? at, then the TIFF block
      if (
        marker === 0xe1 &&
        orientation === null &&
        end <= bytes.length &&
        ascii(bytes, at + 4, at + 9) === 'Exif\0'
      ) {
        orientation = tiffOrientation(view, at + 10, end);
      }

      at = end;
    }
  }

  return null;
}

/**
 * WebP: a RIFF file whose first chunk is one of three kinds.
 * @param {Uint8Array} bytes
 * @param {DataView} view
 * @returns {ImageSize | null}
 */
function webp(bytes, view) {
  const kind = ascii(bytes, 12, 16);

  //? Lossy: three bytes of frame tag, the start code 9d 01 2a, then 14 bits
  //? each of width and height (the top two bits are a scaling hint)
  if (kind === 'VP8 ' && bytes.length >= 30) {
    if (ascii(bytes, 23, 26) !== '\x9d\x01\x2a') return null;

    return {
      format: 'webp',
      width: view.getUint16(26, true) & 0x3fff,
      height: view.getUint16(28, true) & 0x3fff,
    };
  }

  //? Lossless: the signature 2f, then 14 bits of width - 1 and 14 bits of
  //? height - 1 packed into four bytes
  if (kind === 'VP8L' && bytes.length >= 25 && bytes[20] === 0x2f) {
    const bits = view.getUint32(21, true);

    return {
      format: 'webp',
      width: (bits & 0x3fff) + 1,
      height: ((bits >>> 14) & 0x3fff) + 1,
    };
  }

  //? Extended (alpha, colour profile, animation): four bytes of flags, then
  //? 24 bits of width - 1 and 24 bits of height - 1
  if (kind === 'VP8X' && bytes.length >= 30) {
    const u24 = from =>
      bytes[from] | (bytes[from + 1] << 8) | (bytes[from + 2] << 16);

    return { format: 'webp', width: u24(24) + 1, height: u24(27) + 1 };
  }

  return null;
}

/**
 * The format and pixel size of a picture, from the bytes of its file. Null
 * when the bytes are not a PNG, JPEG, WebP or GIF, or stop before the size.
 * The format comes from the content, never from the file name.
 *
 * @param {Uint8Array} bytes the whole file (a Node Buffer is fine). Its
 *   beginning is enough for the stored size; an orientation further in than
 *   the bytes given is not seen.
 * @returns {ImageSize | null}
 */
export function imageSize(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  if (bytes.length >= 8 && view.getUint32(0) === 0x89504e47) {
    return png(bytes, view);
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    return jpeg(bytes, view);
  }

  const start = ascii(bytes, 0, 4);
  if (start === 'RIFF' && ascii(bytes, 8, 12) === 'WEBP') {
    return webp(bytes, view);
  }
  if (start === 'GIF8') return gif(bytes, view);

  return null;
}
