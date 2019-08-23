import CompositeAudioNode from "../../audioNodes/BaseNode";

export interface Instrument {
  play(note: string): (AudioNode | CompositeAudioNode)[];
  triggerRelease(note: string): void;
}
