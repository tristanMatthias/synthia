import { Transport } from "tone"

export const beatsToTime = (beat: number) => {
  if (beat == 0) return '0';

  // TODO: Different times
  const sig = Transport.timeSignature as number;
  const bar = Math.floor(beat / sig);
  const _beat = beat % sig;

  // TODO: Sixteenth
  return `${bar}:${_beat}`;
}
