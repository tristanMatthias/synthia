import {
  SynthiaProjectSynthNodeDelay,
  SynthiaProjectSynthNodeFilter,
  SynthiaProjectSynthNodePan,
  SynthiaProjectSynthNodeReverb,
  SynthiaProjectSynthNodeType,
  SynthiaProjectSynthNodeWave,
} from '@synthia/api/dist/types/index';

export const defaultSynthNodeProperties = (type: SynthiaProjectSynthNodeType) => {
  switch (type) {
    case SynthiaProjectSynthNodeType.wave:
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
      } as SynthiaProjectSynthNodeWave['properties']

    case SynthiaProjectSynthNodeType.filter:
      return {
        type: 'lowpass',
        frequency: 320,
        q: 8,
        gain: 0,
      } as SynthiaProjectSynthNodeFilter['properties']

    case SynthiaProjectSynthNodeType.delay:
      return {
        delayTime: 0.5,
        dryWet: 0.5,
        feedback: 0.7,
      } as SynthiaProjectSynthNodeDelay['properties']

    case SynthiaProjectSynthNodeType.reverb:
      return {
        dryWet: 0.5,
        decayTime: 3,
        fadeInTime: 0.1,
        roomSize: 150000
      } as SynthiaProjectSynthNodeReverb['properties']

    case SynthiaProjectSynthNodeType.pan:
      return {
        pan: 0
      } as SynthiaProjectSynthNodePan['properties']

    default:
      throw Error(`Unknown synth node type ${type}`);
  }
}
