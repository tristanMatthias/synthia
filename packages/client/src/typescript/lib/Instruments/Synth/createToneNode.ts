import { TSynthiaProjectSynthNode } from '@synthia/api';
import { FeedbackDelay, Filter, Panner, PolySynth } from 'tone';
import { SynthiaReverb } from '../../effects/Reverb';


export type ToneNode = PolySynth | FeedbackDelay | SynthiaReverb | Filter | Panner;


export const createToneNode = (node: TSynthiaProjectSynthNode) => {
  switch (node.type) {
    case "wave":
      const synth = new PolySynth();
      synth.set({
        envelope: {
          attack: node.properties.attack,
          decay: node.properties.decay,
          release: node.properties.release,
          sustain: node.properties.sustain
        },
        oscillator: {
          type: node.properties.type
        }
      });
      return synth;

    case "delay":
      return new FeedbackDelay(node.properties.delayTime, node.properties.feedback);

    case "reverb":
      return new SynthiaReverb(node.properties);

    case 'filter':
      return new Filter(node.properties);

    case 'pan':
      return new Panner(node.properties.pan);

    default:
      throw new Error(`Could not create audio node with type ${node.type}`);
  }
}
