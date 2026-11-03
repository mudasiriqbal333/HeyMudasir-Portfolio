/**
 * Next index when stepping through a list that wraps around at both ends.
 * @param {number} index current position
 * @param {number} delta usually 1 or -1
 * @param {number} length number of items
 */
export function cycleIndex(index, delta, length) {
  if (length <= 0) return 0;

  return (((index + delta) % length) + length) % length;
}
