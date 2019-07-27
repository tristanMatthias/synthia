const realNotes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']

/**
 * Maps the keyboard note to a frequency
 * @param key Keyboard keycode
 * @param octave Octave number
 */
export const keyToFrequency = (key: string, octave: number) => {
  const up = key.toUpperCase();
  let note: string | false = false;
  let oct = octave;


  if (up === 'A') note = 'C';
  else if (up === 'W') note = 'C#';
  else if (up === 'S') note = 'D';
  else if (up === 'E') note = 'D#';
  else if (up === 'D') note = 'E';
  else if (up === 'F') note = 'F';
  else if (up === 'T') note = 'F#';
  else if (up === 'G') note = 'G';
  else if (up === 'Y') note = 'G#';
  else if (up === 'H') note = 'A';
  else if (up === 'U') note = 'A#';
  else if (up === 'J') {
    note = 'B';
    oct += 1;
  } else if (up === 'K') {
    note = 'C';
    oct += 1;
  } else if (up === 'O') {
    note = 'C#';
    oct += 1;
  } else if (up === 'L') {
    note = 'D';
    oct += 1;
  }

  if (!note) return false;
  else return noteToFrequency(note, oct);
}


export const noteToFrequency = function (realNote: string, octave: number) {
  const a4 = 440;
  let keyNumber: number;

  keyNumber = realNotes.indexOf(realNote);

  if (keyNumber < 2) keyNumber = keyNumber + 12 + ((octave - 1) * 12) + 1;
  else keyNumber = keyNumber + ((octave - 1) * 12) + 1;

  // Return frequency of note
  return a4 * Math.pow(2, (keyNumber - 49) / 12);
};
