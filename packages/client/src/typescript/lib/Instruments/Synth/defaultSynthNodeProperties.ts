import { SynthiaProjectSynthNodeProperties, SynthNodeType } from '@synthia/api';

export const defaultSynthNodeProperties = (
  type: SynthNodeType
): SynthiaProjectSynthNodeProperties => {
  switch (type as SynthNodeType) {
    case "wave":
      return {
        type: "sine",
        attack: 0.2,
        attackLevel: 1,
        decay: 1,
        decayLevel: 1,
        delay: 0,
        release: 0.2,
        pitch: 0,
        gain: 1
      }

    case "filter":
      return {
        type: 'lowpass',
        frequency: 320,
        q: 8,
        gain: 0,
      }

    case "delay":
      return {
        delayTime: 0.5,
        dryWet: 0.5,
        feedback: 0.7,
      }

    case "reverb":
      return {
        dryWet: 0.5,
        decayTime: 3,
        fadeInTime: 0.1,
        roomSize: 150000
      }

    case "pan":
      return {
        pan: 0
      }

    default:
      throw Error(`Unknown synth node type ${type}`);
  }
}
