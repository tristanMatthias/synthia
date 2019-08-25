import { Encoding } from "tone";

export interface Instrument extends Tone.Instrument {
  /**
     * Trigger the attack of the note optionally with a given velocity
     */
  triggerAttack(notes: Encoding.Frequency[], time?: Encoding.Time, velocity?: number): this;

  /**
   * Trigger the release portion of the envelope
   */
  triggerRelease(notes: Encoding.Frequency[], time?: Encoding.Time): this;
}
