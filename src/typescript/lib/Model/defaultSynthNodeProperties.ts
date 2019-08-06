import { SynthiaFileSynthNodeFilter, SynthiaFileSynthNodeType, SynthiaFileSynthNodeWave, SynthiaFileSynthNodeDelay, SynthiaFileSynthNodeReverb, SynthiaFileSynthNodePan } from '../File/file.type';

export const defaultSynthNodeProperties = (type: SynthiaFileSynthNodeType) => {
  switch (type) {
    case SynthiaFileSynthNodeType.wave:
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
      } as SynthiaFileSynthNodeWave['properties']

    case SynthiaFileSynthNodeType.filter:
      return {
        type: 'lowpass',
        frequency: 320,
        q: 8,
        gain: 0,
      } as SynthiaFileSynthNodeFilter['properties']

    case SynthiaFileSynthNodeType.delay:
      return {
        delayTime: 0.5,
        dryWet: 0.5,
        feedback: 0.7,
      } as SynthiaFileSynthNodeDelay['properties']

    case SynthiaFileSynthNodeType.reverb:
      return {
        dryWet: 0.5,
        decayTime: 3,
        fadeInTime: 0.1,
        roomSize: 150000
      } as SynthiaFileSynthNodeReverb['properties']

    case SynthiaFileSynthNodeType.pan:
      return {
        pan: 0
      } as SynthiaFileSynthNodePan['properties']

    default:
      throw Error(`Unknown synth node type ${type}`);
  }
}
