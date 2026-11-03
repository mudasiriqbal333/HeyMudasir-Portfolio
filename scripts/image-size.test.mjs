import assert from 'node:assert/strict';
import { test } from 'node:test';
import { crc32 } from 'node:zlib';

import { imageSize } from './image-size.mjs';

const bytes = base64 => Buffer.from(base64, 'base64');

//? Real files, a few pixels each, written by an image library (not by this
//? code), so the reader is checked against something it did not produce.
const PNG_5X3 =
  'iVBORw0KGgoAAAANSUhEUgAAAAUAAAADCAIAAADUVFKvAAAAE0lEQVR4nGM8ISfHgASYkDlY+AAwIgEKYR06jAAAAABJRU5ErkJggg==';
const GIF_5X3 =
  'R0lGODdhBQADAIEAAMwAAMwzMwAAAAAAACwAAAAABQADAAAIDAADABAYgCDBgQMDAgA7';
const JPEG_5X3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDACgcHiMeGSgjISMtKygwPGRBPDc3PHtYXUlkkYCZlo+AjIqgtObDoKrarYqMyP/L2u71////m8H////6/+b9//j/2wBDASstLTw1PHZBQXb4pYyl+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj/wAARCAADAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCtRRRWR6B//9k=';
const WEBP_LOSSY_5X3 =
  'UklGRjIAAABXRUJQVlA4ICYAAABwAQCdASoFAAMAB0CWJaACdAFAAAD+5AFjCaSdH8zfhR8nUAAAAA==';
const WEBP_LOSSLESS_5X3 =
  'UklGRh4AAABXRUJQVlA4TBEAAAAvBIAAAAdQjyLXo/+BiOh/AAA=';
const WEBP_LOSSLESS_ALPHA_7X4 =
  'UklGRh4AAABXRUJQVlA4TBEAAAAvBsAAEAdQ5CrUo4CBiOh/AAA=';
const WEBP_EXTENDED_7X4 =
  'UklGRlYAAABXRUJQVlA4WAoAAAAQAAAABgAAAwAAQUxQSAoAAAABB1DAiAhERP8DVlA4ICYAAACwAQCdASoHAAQAB0CWJaACdLoABKoAAPzK9eU+Jtv43m81sdgAAA==';

test('reads the size of a PNG', () => {
  assert.deepEqual(imageSize(bytes(PNG_5X3)), {
    format: 'png',
    width: 5,
    height: 3,
  });
});

test('reads the size of a GIF', () => {
  assert.deepEqual(imageSize(bytes(GIF_5X3)), {
    format: 'gif',
    width: 5,
    height: 3,
  });
});

test('reads the size of a JPEG', () => {
  assert.deepEqual(imageSize(bytes(JPEG_5X3)), {
    format: 'jpeg',
    width: 5,
    height: 3,
  });
});

test('reads the three kinds of WebP header', () => {
  assert.deepEqual(imageSize(bytes(WEBP_LOSSY_5X3)), {
    format: 'webp',
    width: 5,
    height: 3,
  });
  assert.deepEqual(imageSize(bytes(WEBP_LOSSLESS_5X3)), {
    format: 'webp',
    width: 5,
    height: 3,
  });
  assert.deepEqual(imageSize(bytes(WEBP_LOSSLESS_ALPHA_7X4)), {
    format: 'webp',
    width: 7,
    height: 4,
  });
  assert.deepEqual(imageSize(bytes(WEBP_EXTENDED_7X4)), {
    format: 'webp',
    width: 7,
    height: 4,
  });
});

test('reads WebP sizes that need every bit of their fields', () => {
  //? Lossy: 14 bits each for width and height; the top two bits of each pair
  //? are a scaling hint and are not part of the size. 2160 (0x0870) with hint
  //? 1 is the bytes 70 48, 1050 (0x041a) with hint 2 is 1a 84.
  const lossy = Buffer.concat([
    Buffer.from('RIFF\x16\0\0\0WEBPVP8 \x0a\0\0\0', 'latin1'),
    Buffer.from([0x10, 0x4d, 0x0f, 0x9d, 0x01, 0x2a, 0x70, 0x48, 0x1a, 0x84]),
  ]);
  assert.deepEqual(imageSize(lossy), {
    format: 'webp',
    width: 2160,
    height: 1050,
  });

  //? Lossless: after the 0x2f signature come 14 bits of width - 1, 14 bits of
  //? height - 1, the alpha bit and 3 version bits, lowest bit first.
  //? 16384 x 9001 with alpha is 0x3fff | 0x2328 << 14 | 1 << 28 = 0x18ca3fff.
  const lossless = Buffer.concat([
    Buffer.from('RIFF\x12\0\0\0WEBPVP8L\x05\0\0\0', 'latin1'),
    Buffer.from([0x2f, 0xff, 0x3f, 0xca, 0x18, 0]),
  ]);
  assert.deepEqual(imageSize(lossless), {
    format: 'webp',
    width: 16384,
    height: 9001,
  });

  //? Extended: 24 bits each for width - 1 and height - 1 after four bytes of
  //? flags. 70000 x 66000 is 0x01116f and 0x0101cf, lowest byte first.
  const extended = Buffer.concat([
    Buffer.from('RIFF\x16\0\0\0WEBPVP8X\x0a\0\0\0', 'latin1'),
    Buffer.from([0, 0, 0, 0, 0x6f, 0x11, 0x01, 0xcf, 0x01, 0x01]),
  ]);
  assert.deepEqual(imageSize(extended), {
    format: 'webp',
    width: 70000,
    height: 66000,
  });
});

/**
 * The TIFF block a camera or phone writes its orientation in: a JPEG keeps
 * it in an Exif segment, a PNG in an eXIf chunk.
 * @param {'MM' | 'II'} order byte order of the block: big or little end first
 * @param {number[][]} fields each [tag, type, count, value]; a type of 3 is
 *   a 16-bit number, 4 a 32-bit one
 * @param {{magic?: number}} [options] the number after the byte order, 42 in
 *   every real block
 */
function tiff(order, fields, { magic = 42 } = {}) {
  const big = order === 'MM';
  const u16 = value =>
    big ? [value >> 8, value & 255] : [value & 255, value >> 8];
  const u32 = value => (big ? [0, 0, 0, value] : [value, 0, 0, 0]);

  return Buffer.from([
    ...Buffer.from(order, 'latin1'),
    ...u16(magic),
    ...u32(8), //? the list of fields starts 8 bytes in
    ...u16(fields.length),
    ...fields.flatMap(([tag, type, count, value]) => [
      ...u16(tag),
      ...u16(type),
      ...u32(count),
      //? a 16-bit value sits at the front of its four bytes
      ...(type === 3 ? [...u16(value), 0, 0] : u32(value)),
    ]),
    ...u32(0), //? no further list
  ]);
}

//? The tag of the orientation field. Browsers read it when it is written
//? one way only: as type 3 (a 16-bit number), with a count of one.
const ORIENTATION = 0x0112;

/**
 * A TIFF block holding only the orientation.
 * @param {number} orientation 1 to 8
 * @param {'MM' | 'II'} [order]
 */
const turn = (orientation, order = 'MM') =>
  tiff(order, [[ORIENTATION, 3, 1, orientation]]);

/**
 * A JPEG's Exif segment around a TIFF block.
 * @param {Buffer} block
 * @param {string} [name] the six bytes that open the segment
 */
function exifSegment(block, name = 'Exif\0\0') {
  const body = [...Buffer.from(name, 'latin1'), ...block];

  return Buffer.from([0xff, 0xe1, 0, body.length + 2, ...body]);
}

/**
 * The Exif segment a camera or phone writes, holding only the orientation.
 * @param {number} orientation 1 to 8
 * @param {'MM' | 'II'} order
 * @param {string} [name]
 */
const exif = (orientation, order, name) =>
  exifSegment(turn(orientation, order), name);

/** The real 5x3 JPEG with blocks put in after its first segment. */
function jpegWith(...blocks) {
  const jpeg = bytes(JPEG_5X3);
  //? 2 bytes of start marker and the 18-byte JFIF segment come first
  return Buffer.concat([jpeg.subarray(0, 20), ...blocks, jpeg.subarray(20)]);
}

/**
 * A PNG chunk: the length of the content, a four-letter name, the content
 * and a checksum of the name and content.
 * @param {string} name
 * @param {Uint8Array | number[]} content
 */
function chunk(name, content) {
  const body = Buffer.concat([
    Buffer.from(name, 'latin1'),
    Buffer.from(content),
  ]);
  const whole = Buffer.alloc(body.length + 8);

  whole.writeUInt32BE(content.length, 0);
  body.copy(whole, 4);
  whole.writeUInt32BE(crc32(body), body.length + 4);

  return whole;
}

//? Where the real 5x3 PNG's header chunk ends (8 bytes of signature, then 25)
//? and where its closing chunk begins (12 bytes before the end).
const PNG_HEADER = 33;
const PNG_CLOSING = 12;

/** The real 5x3 PNG with chunks put in before its picture data. */
function pngWith(...chunks) {
  const png = bytes(PNG_5X3);

  return Buffer.concat([
    png.subarray(0, PNG_HEADER),
    ...chunks,
    png.subarray(PNG_HEADER),
  ]);
}

/** A PNG (the real one, or one made above) with chunks put in after its picture data. */
function pngWithLate(png, ...chunks) {
  const closing = png.length - PNG_CLOSING;

  return Buffer.concat([
    png.subarray(0, closing),
    ...chunks,
    png.subarray(closing),
  ]);
}

const UPRIGHT = { width: 5, height: 3 };
const TURNED = { width: 3, height: 5 };

test('a JPEG turned on its side by its Exif orientation swaps width and height', () => {
  //? 1-4 are upright or mirrored, 5-8 are turned a quarter: browsers show
  //? those 3 wide and 5 tall
  const shown = {
    1: [5, 3],
    2: [5, 3],
    3: [5, 3],
    4: [5, 3],
    5: [3, 5],
    6: [3, 5],
    7: [3, 5],
    8: [3, 5],
  };

  for (const order of /** @type {const} */ (['MM', 'II'])) {
    for (const [orientation, [width, height]] of Object.entries(shown)) {
      assert.deepEqual(
        imageSize(jpegWith(exif(Number(orientation), order))),
        { format: 'jpeg', width, height },
        `orientation ${orientation}, byte order ${order}`,
      );
    }
  }
});

test('only an Exif segment can turn a JPEG', () => {
  //? XMP data uses the same marker as Exif. The same bytes under another
  //? name must not be read as an orientation.
  assert.deepEqual(imageSize(jpegWith(exif(6, 'MM', 'http:/'))), {
    format: 'jpeg',
    width: 5,
    height: 3,
  });
});

test('the name of a JPEG Exif segment is "Exif" and a zero byte, whatever follows', () => {
  //? Browsers do not look at the sixth byte
  assert.deepEqual(imageSize(jpegWith(exif(6, 'MM', 'Exif\0x'))), {
    format: 'jpeg',
    ...TURNED,
  });
  assert.deepEqual(imageSize(jpegWith(exif(6, 'MM', 'exif\0\0'))), {
    format: 'jpeg',
    ...UPRIGHT,
  });
});

test('only the first Exif segment of a JPEG counts', () => {
  const none = exifSegment(tiff('MM', [[0x0128, 3, 1, 2]]));
  const cases = [
    ['turned, then upright', [exif(6, 'MM'), exif(1, 'MM')], TURNED],
    ['upright, then turned', [exif(1, 'MM'), exif(6, 'MM')], UPRIGHT],
    ['no orientation, then turned', [none, exif(6, 'MM')], UPRIGHT],
    ['turned, then no orientation', [exif(6, 'MM'), none], TURNED],
    //? Other data under the same marker (XMP) is not an Exif segment
    ['XMP, then turned', [exif(1, 'MM', 'http:/'), exif(6, 'MM')], TURNED],
  ];

  for (const [what, blocks, shown] of cases) {
    assert.deepEqual(
      imageSize(jpegWith(...blocks)),
      { format: 'jpeg', ...shown },
      what,
    );
  }
});

test('a PNG turned on its side by its eXIf chunk swaps width and height', () => {
  //? The same eight orientations as a JPEG's, kept in a chunk before the
  //? picture data: browsers show 5 to 8 with width and height swapped
  for (const order of /** @type {const} */ (['MM', 'II'])) {
    for (let orientation = 1; orientation <= 8; orientation += 1) {
      assert.deepEqual(
        imageSize(pngWith(chunk('eXIf', turn(orientation, order)))),
        { format: 'png', ...(orientation >= 5 ? TURNED : UPRIGHT) },
        `orientation ${orientation}, byte order ${order}`,
      );
    }
  }
});

test('a PNG finds its eXIf chunk among the other chunks before the picture data', () => {
  const png = pngWith(
    chunk('gAMA', [0, 0, 0xb1, 0x8f]),
    chunk('tEXt', Buffer.from('Comment\0a screenshot', 'latin1')),
    chunk('eXIf', turn(6)),
  );

  assert.deepEqual(imageSize(png), { format: 'png', ...TURNED });
  //? ...also when the file is a view into a larger buffer
  const padded = Buffer.concat([Buffer.alloc(7, 1), png]);
  assert.deepEqual(imageSize(padded.subarray(7)), {
    format: 'png',
    ...TURNED,
  });
});

test('only the first eXIf chunk of a PNG counts, and only before the picture data', () => {
  const none = chunk('eXIf', tiff('MM', [[0x0128, 3, 1, 2]]));
  const upright = chunk('eXIf', turn(1));
  const turned = chunk('eXIf', turn(6));
  const cases = [
    ['turned, then upright', pngWith(turned, upright), TURNED],
    ['upright, then turned', pngWith(upright, turned), UPRIGHT],
    ['no orientation, then turned', pngWith(none, turned), UPRIGHT],
    ['after the picture data', pngWithLate(bytes(PNG_5X3), turned), UPRIGHT],
    [
      'turned before the picture data, upright after it',
      pngWithLate(pngWith(turned), upright),
      TURNED,
    ],
    //? A chunk name is told apart by its capitals too
    ['a chunk named exIf', pngWith(chunk('exIf', turn(6))), UPRIGHT],
    //? A JPEG's "Exif" opening does not belong in a PNG chunk
    [
      'a chunk that opens as a JPEG segment does',
      pngWith(chunk('eXIf', Buffer.concat([Buffer.from('Exif\0\0'), turn(6)]))),
      UPRIGHT,
    ],
  ];

  for (const [what, png, shown] of cases) {
    assert.deepEqual(imageSize(png), { format: 'png', ...shown }, what);
  }
});

/** The same TIFF block in a JPEG and in a PNG: both must read it alike. */
const inBoth = block => [
  ['jpeg', jpegWith(exifSegment(block))],
  ['png', pngWith(chunk('eXIf', block))],
];

test('an orientation counts only when it is written as one 16-bit number from 1 to 8', () => {
  const ignored = [
    ['a 32-bit number', tiff('II', [[ORIENTATION, 4, 1, 6]])],
    ['a single byte', tiff('II', [[ORIENTATION, 1, 1, 6]])],
    ['two numbers', tiff('MM', [[ORIENTATION, 3, 2, 6]])],
    ['zero', turn(0)],
    ['nine', turn(9)],
  ];

  for (const [what, block] of ignored) {
    for (const [format, file] of inBoth(block)) {
      assert.deepEqual(imageSize(file), { format, ...UPRIGHT }, what);
    }
  }
});

test('the first orientation that counts is the one used', () => {
  const cases = [
    [
      'among other fields',
      [
        [0x0100, 3, 1, 5],
        [ORIENTATION, 3, 1, 6],
      ],
      TURNED,
    ],
    [
      'turned, then upright',
      [
        [ORIENTATION, 3, 1, 6],
        [ORIENTATION, 3, 1, 1],
      ],
      TURNED,
    ],
    [
      'upright, then turned',
      [
        [ORIENTATION, 3, 1, 1],
        [ORIENTATION, 3, 1, 6],
      ],
      UPRIGHT,
    ],
    //? One that does not count is passed over, not taken as "upright"
    [
      'a 32-bit number, then turned',
      [
        [ORIENTATION, 4, 1, 6],
        [ORIENTATION, 3, 1, 6],
      ],
      TURNED,
    ],
    [
      'nine, then turned',
      [
        [ORIENTATION, 3, 1, 9],
        [ORIENTATION, 3, 1, 6],
      ],
      TURNED,
    ],
    [
      'zero, then turned',
      [
        [ORIENTATION, 3, 1, 0],
        [ORIENTATION, 3, 1, 6],
      ],
      TURNED,
    ],
  ];

  for (const [what, fields, shown] of cases) {
    for (const order of /** @type {const} */ (['MM', 'II'])) {
      for (const [format, file] of inBoth(tiff(order, fields))) {
        assert.deepEqual(
          imageSize(file),
          { format, ...shown },
          `${what}, ${order}`,
        );
      }
    }
  }
});

test('an Exif block that does not open as TIFF data is ignored', () => {
  const wrongOrder = turn(6);
  wrongOrder[0] = 0x58; //? "XM" instead of "MM"
  const mixedOrder = turn(6);
  mixedOrder[1] = 0x49; //? "MI"
  const ignored = [
    [
      'a number other than 42 after the byte order',
      tiff('MM', [[ORIENTATION, 3, 1, 6]], { magic: 43 }),
    ],
    [
      'the same, lowest byte first',
      tiff('II', [[ORIENTATION, 3, 1, 6]], { magic: 43 }),
    ],
    ['a byte order that is neither MM nor II', wrongOrder],
    ['a byte order of two different letters', mixedOrder],
    ['nothing at all', Buffer.alloc(0)],
    ['a block cut off inside its opening', turn(6).subarray(0, 6)],
  ];

  for (const [what, block] of ignored) {
    for (const [format, file] of inBoth(block)) {
      assert.deepEqual(imageSize(file), { format, ...UPRIGHT }, what);
    }

    //? ...also when the bytes given stop right after the block: nothing
    //? beyond it may be read
    const png = pngWith(chunk('eXIf', block));
    const stop = PNG_HEADER + 8 + block.length;
    assert.deepEqual(
      imageSize(png.subarray(0, stop)),
      { format: 'png', ...UPRIGHT },
      `${what}, at the end of the bytes`,
    );
  }
});

test('a list of fields is read as far as it is really there', () => {
  //? turn(6) is 26 bytes: 8 of opening, 2 of count, the 12-byte field and 4
  //? that point to a further list
  const whole = turn(6);
  const claimsThree = Buffer.from(whole);
  claimsThree[9] = 3; //? says three fields, holds one
  const cases = [
    ['without the pointer to a further list', whole.subarray(0, 22), TURNED],
    ['a count larger than the list', claimsThree, TURNED],
    ['cut inside the only field', whole.subarray(0, 18), UPRIGHT],
    //? ...even with the value itself still there: a field counts whole
    ['cut after the value of the only field', whole.subarray(0, 20), UPRIGHT],
    ['cut before the count', whole.subarray(0, 9), UPRIGHT],
  ];

  for (const [what, block, shown] of cases) {
    for (const [format, file] of inBoth(block)) {
      assert.deepEqual(imageSize(file), { format, ...shown }, what);
    }
  }
});

test('a list of fields can start anywhere in the block', () => {
  //? 16 bytes in instead of the usual 8
  const whole = turn(6, 'II');
  const moved = Buffer.concat([
    whole.subarray(0, 4),
    Buffer.from([16, 0, 0, 0]),
    Buffer.alloc(8),
    whole.subarray(8),
  ]);
  //? ...and a start beyond the end of the block is no list at all
  const beyond = Buffer.from(whole);
  beyond[4] = 200;

  for (const [format, file] of inBoth(moved)) {
    assert.deepEqual(imageSize(file), { format, ...TURNED });
  }
  for (const [format, file] of inBoth(beyond)) {
    assert.deepEqual(imageSize(file), { format, ...UPRIGHT });
  }
});

test('a PNG cut off among its chunks still gives its stored size', () => {
  const png = pngWith(
    chunk('tEXt', Buffer.from('Comment\0x', 'latin1')),
    chunk('eXIf', turn(6)),
  );

  //? Every cut from the end of the header chunk on: never a crash, and
  //? turned only once the whole eXIf chunk is there
  const exifEnd = PNG_HEADER + 12 + 9 + 12 + turn(6).length;
  for (let length = PNG_HEADER; length <= png.length; length += 1) {
    assert.deepEqual(
      imageSize(png.subarray(0, length)),
      { format: 'png', ...(length >= exifEnd - 4 ? TURNED : UPRIGHT) },
      `cut at ${length}`,
    );
  }
});

/** A JPEG segment: `ff`, the marker, a 16-bit length and the content. */
const segment = (marker, content) =>
  Buffer.from([0xff, marker, 0, content.length + 2, ...content]);

//? A frame header's content: 8 bits a sample, height, width, one component
const frame = (width, height) => [8, 0, height, 0, width, 1, 1, 0x11, 0];
const START = Buffer.from([0xff, 0xd8]);

test('reads the size from every kind of JPEG frame', () => {
  //? Baseline (c0), progressive (c2) and the rarer kinds all carry the size
  const kinds = [
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce,
    0xcf,
  ];

  for (const marker of kinds) {
    assert.deepEqual(
      imageSize(Buffer.concat([START, segment(marker, frame(5, 3))])),
      { format: 'jpeg', width: 5, height: 3 },
      `marker ${marker.toString(16)}`,
    );
  }
});

test('skips the JPEG tables whose markers sit among the frame markers', () => {
  //? c4, c8 and cc are not frames. Read as one, this content would say 7x9.
  for (const marker of [0xc4, 0xc8, 0xcc]) {
    const file = Buffer.concat([
      START,
      segment(marker, frame(7, 9)),
      segment(0xc0, frame(5, 3)),
    ]);

    assert.deepEqual(
      imageSize(file),
      { format: 'jpeg', width: 5, height: 3 },
      `marker ${marker.toString(16)}`,
    );
  }
});

test('steps over padding before a JPEG marker', () => {
  const file = Buffer.concat([
    START,
    Buffer.from([0xff, 0xff]),
    segment(0xc0, frame(5, 3)),
  ]);

  assert.deepEqual(imageSize(file), { format: 'jpeg', width: 5, height: 3 });
});

test('works on a view into a larger buffer', () => {
  const padded = Buffer.concat([Buffer.alloc(7, 1), bytes(PNG_5X3)]);

  assert.deepEqual(imageSize(padded.subarray(7)), {
    format: 'png',
    width: 5,
    height: 3,
  });
});

test('gives null for anything that is not a picture it can read', () => {
  assert.equal(imageSize(Buffer.alloc(0)), null);
  assert.equal(imageSize(Buffer.from('not a picture at all')), null);
  //? An mp4 starts with its "ftyp" box
  assert.equal(
    imageSize(Buffer.from('\0\0\0\x18ftypmp42\0\0\0\0mp42isom', 'latin1')),
    null,
  );
  //? A RIFF file that is not WebP (a WAV sound)
  assert.equal(
    imageSize(Buffer.from('RIFF\x24\0\0\0WAVEfmt \x10\0\0\0', 'latin1')),
    null,
  );
  //? ...even one whose first chunk is named like a WebP chunk
  assert.equal(
    imageSize(
      Buffer.concat([
        Buffer.from('RIFF\x16\0\0\0AVI VP8X\x0a\0\0\0', 'latin1'),
        Buffer.from([0, 0, 0, 0, 0x6f, 0x11, 0x01, 0xcf, 0x01, 0x01]),
      ]),
    ),
    null,
  );
});

test('gives null for a picture cut off before its size', () => {
  assert.equal(imageSize(bytes(PNG_5X3).subarray(0, 20)), null);
  assert.equal(imageSize(bytes(GIF_5X3).subarray(0, 8)), null);
  assert.equal(imageSize(bytes(WEBP_LOSSY_5X3).subarray(0, 28)), null);
  assert.equal(imageSize(bytes(WEBP_LOSSLESS_5X3).subarray(0, 24)), null);
  assert.equal(imageSize(bytes(WEBP_EXTENDED_7X4).subarray(0, 29)), null);
  //? The JPEG's size sits in a segment far into the file: stop before it
  assert.equal(imageSize(bytes(JPEG_5X3).subarray(0, 100)), null);
  //? ...and in the middle of a segment's own length bytes
  assert.equal(imageSize(bytes(JPEG_5X3).subarray(0, 3)), null);
  //? ...and inside the frame segment itself, before its width
  const cut = Buffer.concat([START, segment(0xc0, frame(5, 3))]);
  assert.equal(imageSize(cut.subarray(0, 8)), null);
});

test('never takes a JPEG size from after the picture data has begun', () => {
  //? da starts the picture data and d9 ends the file: with no frame before
  //? them there is no size, whatever the bytes after them look like
  for (const marker of [0xda, 0xd9]) {
    const file = Buffer.concat([
      START,
      segment(marker, [1, 2, 3]),
      segment(0xc0, frame(7, 9)),
    ]);

    assert.equal(imageSize(file), null, `marker ${marker.toString(16)}`);
  }
});

test('gives null for a WebP chunk that does not start as it must', () => {
  //? The lossy and lossless examples above with one byte of the fixed
  //? opening changed: 9d 01 2a became 9d 01 2b, and 2f became 2e
  const lossy = Buffer.concat([
    Buffer.from('RIFF\x16\0\0\0WEBPVP8 \x0a\0\0\0', 'latin1'),
    Buffer.from([0x10, 0x4d, 0x0f, 0x9d, 0x01, 0x2b, 0x70, 0x48, 0x1a, 0x84]),
  ]);
  const lossless = Buffer.concat([
    Buffer.from('RIFF\x12\0\0\0WEBPVP8L\x05\0\0\0', 'latin1'),
    Buffer.from([0x2e, 0xff, 0x3f, 0xca, 0x18, 0]),
  ]);

  assert.equal(imageSize(lossy), null);
  assert.equal(imageSize(lossless), null);
});
