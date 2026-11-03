//? en-GB carries the European zone abbreviations (CET/CEST) that en-US lacks.
const LOCALE = 'en-GB';

/**
 * Hands out one formatter per time zone, built the first time that zone is
 * asked for. The footer clock formats once a second, and building an
 * Intl.DateTimeFormat costs far more than a call to its `format`.
 * @param {Intl.DateTimeFormatOptions} options
 * @returns {(timeZone: string) => Intl.DateTimeFormat}
 */
function formatterPerZone(options) {
  /** @type {Map<string, Intl.DateTimeFormat>} */
  const formatters = new Map();

  return timeZone => {
    let formatter = formatters.get(timeZone);
    if (!formatter) {
      formatter = new Intl.DateTimeFormat(LOCALE, { ...options, timeZone });
      formatters.set(timeZone, formatter);
    }

    return formatter;
  };
}

const labelFormatter = formatterPerZone({
  timeZoneName: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

const valueFormatter = formatterPerZone({
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/**
 * Formats a date as e.g. "05:46 AM CEST" in the given IANA time zone.
 * Zones without a CLDR abbreviation fall back to a GMT offset, e.g. "GMT+5".
 * @param {Date} date
 * @param {string} timeZone
 */
export function formatLocalTime(date, timeZone) {
  return labelFormatter(timeZone)
    .format(date)
    .replace(/\s/g, ' ')
    .toUpperCase();
}

/**
 * Machine-readable "HH:MM" (24-hour) in the given zone, for `<time dateTime>`.
 * @param {Date} date
 * @param {string} timeZone
 */
export function formatLocalTimeValue(date, timeZone) {
  return valueFormatter(timeZone).format(date);
}

/**
 * What a clock that last showed `previous` shows at `date`. While the label
 * still reads the same, the very same object comes back, so a clock that
 * checks every second only changes when its text does, once a minute.
 * @param {{label: string, value: string}} previous
 * @param {Date} date
 * @param {string} timeZone
 * @returns {{label: string, value: string}}
 */
export function nextLocalTime(previous, date, timeZone) {
  const label = formatLocalTime(date, timeZone);
  if (label === previous.label) return previous;

  return { label, value: formatLocalTimeValue(date, timeZone) };
}
