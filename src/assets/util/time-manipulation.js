/**
 * Takes human time input and outputs time in ms (eg: 5m 30s -> 330000 | 3d 5h 2m -> 277320000)
 * @param {string} timeStr - Time input (eg: 1m 20s, 1s, 3h 20m)
 */
const timeStringToMS = function (timeString) {
  return timeString.match(/\d+\s?\w/g).reduce((acc, cur) => {
    var multiplier = 1000;
    switch (cur.slice(-1)) {
      case 'd':
        multiplier *= 24;
      case 'h':
        multiplier *= 60;
      case 'm':
        multiplier *= 60;
      case 's':
        return ((parseInt(cur) ? parseInt(cur) : 0) * multiplier) + acc;
    }
    return acc;
  }, 0);
}

const formatMS = function (milliseconds, minimal = false) {
  if (typeof milliseconds === 'undefined' || isNaN(milliseconds)) {
    throw new RangeError('Util#formatMS() Milliseconds must be a number');
  }
  if (typeof minimal !== 'boolean') {
    throw new RangeError('Util#formatMS() Minimal must be a boolean');
  }
  if (milliseconds === 0) { return minimal ? '00:00' : 'N/A'; }
  const times = {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };
  while (milliseconds > 0) {
    if (milliseconds - 31557600000 >= 0) {
      milliseconds -= 31557600000;
      times.years++;
    } else if (milliseconds - 2628000000 >= 0) {
      milliseconds -= 2628000000;
      times.months++;
    } else if (milliseconds - 604800000 >= 0) {
      milliseconds -= 604800000;
      times.weeks += 7;
    } else if (milliseconds - 86400000 >= 0) {
      milliseconds -= 86400000;
      times.days++;
    } else if (milliseconds - 3600000 >= 0) {
      milliseconds -= 3600000;
      times.hours++;
    } else if (milliseconds - 60000 >= 0) {
      milliseconds -= 60000;
      times.minutes++;
    } else {
      times.seconds = Math.round(milliseconds / 1000);
      milliseconds = 0;
    }
  }
  const finalTime = [];
  let first = false;
  // eslint-disable-next-line id-length
  for (const [k, v] of Object.entries(times)) {
    if (minimal) {
      if (v === 0 && !first) { continue; }
      finalTime.push(v < 10 ? `0${v}` : `${v}`);
      first = true;
      continue;
    }
    if (v > 0) { finalTime.push(`${v} ${v > 1 ? k : k.slice(0, -1)}`); }
  }
  if (minimal && finalTime.length === 1) { finalTime.unshift('00'); }
  let time = finalTime.join(minimal ? ':' : ', ');
  if (time.includes(',')) {
    const pos = time.lastIndexOf(',');
    time = `${time.slice(0, pos)} and ${time.slice(pos + 1)}`;
  }
  return time;
}

export {
  timeStringToMS,
  formatMS
}