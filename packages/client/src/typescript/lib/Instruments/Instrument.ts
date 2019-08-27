import { Encoding } from "tone";
import { ESynth } from "@synthia/api";

export interface Instrument extends Tone.Instrument {
  id: string;
  instrumentObject: ESynth;
  /**
     * Trigger the attack of the note optionally with a given velocity
     */
  triggerAttack(notes: Encoding.Frequency[], time?: Encoding.Time, velocity?: number): this;

  /**
   * Trigger the release portion of the envelope
   */
  triggerRelease(notes: Encoding.Frequency[], time?: Encoding.Time): this;
}
