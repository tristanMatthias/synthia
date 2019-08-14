import { createUnionType, Field, InputType, ObjectType } from 'type-graphql';
import { SynthNodeTypeEnum } from './SynthNodeEntity';



export type SynthiaProjectSynthNodeProperties =
  ESynthiaProjectSynthNodeOscillatorProperties |
  ESynthiaProjectSynthNodeWaveProperties |
  ESynthiaProjectSynthNodeReverbProperties |
  ESynthiaProjectSynthNodeDelayProperties |
  ESynthiaProjectSynthNodeFilterProperties |
  ESynthiaProjectSynthNodePanProperties;

export type SynthiaProjectSynthNodeInputProperties =
  ESynthiaProjectSynthNodeOscillatorPropertiesInput |
  ESynthiaProjectSynthNodeWavePropertiesInput |
  ESynthiaProjectSynthNodeReverbPropertiesInput |
  ESynthiaProjectSynthNodeDelayPropertiesInput |
  ESynthiaProjectSynthNodeFilterPropertiesInput |
  ESynthiaProjectSynthNodePanPropertiesInput;

@ObjectType()
export class ESynthiaProjectSynthNodeOscillatorProperties {
  @Field()
  type: SynthNodeTypeEnum.oscillator
}
@InputType()
export class ESynthiaProjectSynthNodeOscillatorPropertiesInput {
  @Field()
  type: SynthNodeTypeEnum.oscillator
}


@ObjectType()
export class ESynthiaProjectSynthNodeWaveProperties {
  @Field() type: OscillatorType
  @Field() delay: number
  @Field() attack: number
  @Field() attackLevel: number
  @Field() decay: number
  @Field() decayLevel: number
  @Field() release: number
  @Field() pitch: number
  @Field() gain: number
}
@InputType()
export class ESynthiaProjectSynthNodeWavePropertiesInput {
  @Field() type: OscillatorType
  @Field() delay: number
  @Field() attack: number
  @Field() attackLevel: number
  @Field() decay: number
  @Field() decayLevel: number
  @Field() release: number
  @Field() pitch: number
  @Field() gain: number
}

@ObjectType()
export class ESynthiaProjectSynthNodeReverbProperties {
  @Field() roomSize: number;
  @Field() decayTime: number;
  @Field() fadeInTime: number;
  @Field() dryWet: number;
}
@InputType()
export class ESynthiaProjectSynthNodeReverbPropertiesInput {
  @Field() roomSize: number;
  @Field() decayTime: number;
  @Field() fadeInTime: number;
  @Field() dryWet: number;
}

@ObjectType()
export class ESynthiaProjectSynthNodeDelayProperties {
  @Field() delayTime: number;
  @Field() feedback: number;
  @Field() dryWet: number;
}
@InputType()
export class ESynthiaProjectSynthNodeDelayPropertiesInput {
  @Field() delayTime: number;
  @Field() feedback: number;
  @Field() dryWet: number;
}

@ObjectType()
export class ESynthiaProjectSynthNodeFilterProperties {
  @Field() type: BiquadFilterType
  @Field() frequency: number
  @Field() q: number
  @Field() gain: number
}
@InputType()
export class ESynthiaProjectSynthNodeFilterPropertiesInput {
  @Field() type: BiquadFilterType
  @Field() frequency: number
  @Field() q: number
  @Field() gain: number
}

@ObjectType()
export class ESynthiaProjectSynthNodePanProperties {
  @Field() pan: number;
}
@InputType()
export class ESynthiaProjectSynthNodePanPropertiesInput {
  @Field() pan: number;
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

// export const SynthNodePropertiesInputUnion: SynthiaProjectSynthNodeInputProperties = createUnionType({
//   name: 'SynthNodePropertiesInput',
//   types: [
//     ESynthiaProjectSynthNodeOscillatorPropertiesInput,
//     ESynthiaProjectSynthNodeWavePropertiesInput,
//     ESynthiaProjectSynthNodeReverbPropertiesInput,
//     ESynthiaProjectSynthNodeDelayPropertiesInput,
//     ESynthiaProjectSynthNodeFilterPropertiesInput,
//     ESynthiaProjectSynthNodePanPropertiesInput,
//   ],
//   resolveType: (value: any) => {
//     if (value.attack !== undefined && value.attackLevel !== undefined) return ESynthiaProjectSynthNodeWavePropertiesInput;
//     if (value.roomSize !== undefined) return ESynthiaProjectSynthNodeReverbPropertiesInput;
//     if (value.delayTime !== undefined) return ESynthiaProjectSynthNodeDelayPropertiesInput;
//     if (value.q !== undefined) return ESynthiaProjectSynthNodeFilterPropertiesInput;
//     if (value.pan !== undefined) return ESynthiaProjectSynthNodePanPropertiesInput;
//     return undefined;
//   }
// });
