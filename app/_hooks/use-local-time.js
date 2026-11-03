'use client';

import { useEffect, useState } from 'react';

import { nextLocalTime } from '@/utils';

const empty = { label: '', value: '' };

/**
 * Live clock, checked every second: `label` such as "05:46 AM CEST" and a
 * machine-readable `value` such as "05:46" for `<time dateTime>`.
 * The state only changes when the label does, once a minute, so whatever
 * shows the clock is not rendered again every second.
 * Returns empty strings until mounted to avoid hydration mismatches.
 * @param {string} timeZone IANA time zone, e.g. 'Europe/Amsterdam'
 */
export function useLocalTime(timeZone) {
  const [time, setTime] = useState(empty);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(previous => nextLocalTime(previous, now, timeZone));
    };
    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [timeZone]);

  return time;
}
