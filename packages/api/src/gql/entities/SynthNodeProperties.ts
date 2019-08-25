import { createUnionType, Field, ObjectType } from 'type-graphql';

import { SynthNodeTypeEnum } from './SynthNodeEntity';
import { BasicOscillatorType } from 'tone';


export type SynthiaProjectSynthNodeProperties =
  ESynthiaProjectSynthNodeOscillatorProperties |
  ESynthiaProjectSynthNodeWaveProperties |
  ESynthiaProjectSynthNodeReverbProperties |
  ESynthiaProjectSynthNodeDelayProperties |
  ESynthiaProjectSynthNodeFilterProperties |
  ESynthiaProjectSynthNodePanProperties;

@ObjectType()
export class ESynthiaProjectSynthNodeOscillatorProperties {
  @Field()
  type: SynthNodeTypeEnum.oscillator
}


@ObjectType()
export class ESynthiaProjectSynthNodeWaveProperties {
  @Field()
  type: BasicOscillatorType
  // @Field()
  // delay: number
  @Field()
  attack: number
  // @Field()
  // attackLevel: number
  @Field()
  decay: number
  @Field()
  sustain: number
  // @Field()
  // decayLevel: number
  @Field()
  release: number
  @Field()
  pitch: number
  // @Field()
  // gain: number
}

@ObjectType()
export class ESynthiaProjectSynthNodeReverbProperties {
  @Field()
  roomSize: number;
  @Field()
  decayTime: number;
  @Field()
  fadeInTime: number;
  @Field()
  dryWet: number;
}

@ObjectType()
export class ESynthiaProjectSynthNodeDelayProperties {
  @Field()
  delayTime: number;
  @Field()
  feedback: number;
  @Field()
  dryWet: number;
}

@ObjectType()
export class ESynthiaProjectSynthNodeFilterProperties {
  @Field()
  type: BiquadFilterType
  @Field()
  frequency: number
  @Field()
  Q: number
  @Field()
  gain: number
}

@ObjectType()
export class ESynthiaProjectSynthNodePanProperties {
  @Field()
  pan: number;
}


export const SynthNodePropertiesUnion: SynthiaProjectSynthNodeProperties = createUnionType({
  name: 'SynthNodeProperties',
  types: [
    ESynthiaProjectSynthNodeOscillatorProperties,
    ESynthiaProjectSynthNodeWaveProperties,
    ESynthiaProjectSynthNodeReverbProperties,
    ESynthiaProjectSynthNodeDelayProperties,
    ESynthiaProjectSynthNodeFilterProperties,
    ESynthiaProjectSynthNodePanProperties,
  ],
  resolveType: (value: any) => {
    if (value.attack !== undefined && value.attackLevel !== undefined) return ESynthiaProjectSynthNodeWaveProperties;
    if (value.roomSize !== undefined) return ESynthiaProjectSynthNodeReverbProperties;
    if (value.delayTime !== undefined) return ESynthiaProjectSynthNodeDelayProperties;
    if (value.q !== undefined) return ESynthiaProjectSynthNodeFilterProperties;
    if (value.pan !== undefined) return ESynthiaProjectSynthNodePanProperties;
    return undefined;
  }
});
