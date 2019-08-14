import { createUnionType, Field, ObjectType, registerEnumType } from 'type-graphql';

import { EPosition } from './SynthEntity';
import {
  ESynthiaProjectSynthNodeDelayProperties,
  ESynthiaProjectSynthNodeFilterProperties,
  ESynthiaProjectSynthNodeOscillatorProperties,
  ESynthiaProjectSynthNodePanProperties,
  ESynthiaProjectSynthNodeReverbProperties,
  ESynthiaProjectSynthNodeWaveProperties,
} from './SynthNodeProperties';


export enum SynthNodeTypeEnum {
  oscillator = 'oscillator',
  wave = 'wave',
  reverb = 'reverb',
  delay = 'delay',
  filter = 'filter',
  pan = 'pan'
}

export type SynthNodeType = 'oscillator' | 'wave' | 'reverb' | 'delay' | 'filter' | 'pan';

export const TSynthNodeType = registerEnumType(SynthNodeTypeEnum, {
  name: "SynthNodeType"
});


@ObjectType()
class ESynthiaProjectSynthNodeBase {
  @Field()
  id: string;

  @Field(() => SynthNodeTypeEnum)
  type: SynthNodeType;

  @Field(() => [String])
  connectedTo: string[];

  @Field(() => [String])
  receives: string[];

  @Field(() => EPosition)
  position: EPosition;
}

export type TSynthiaProjectSynthNode =
  ESynthiaProjectSynthNodeOscillator |
  ESynthiaProjectSynthNodeWave |
  ESynthiaProjectSynthNodeReverb |
  ESynthiaProjectSynthNodeDelay |
  ESynthiaProjectSynthNodeFilter |
  ESynthiaProjectSynthNodePan;

@ObjectType()
export class ESynthiaProjectSynthNodeOscillator extends ESynthiaProjectSynthNodeBase {
  @Field(() => SynthNodeTypeEnum)
  type: "oscillator";
  @Field(() => ESynthiaProjectSynthNodeOscillatorProperties)
  properties: ESynthiaProjectSynthNodeOscillatorProperties;
}
@ObjectType()
export class ESynthiaProjectSynthNodeWave extends ESynthiaProjectSynthNodeBase {
  @Field(() => SynthNodeTypeEnum)
  type: "wave";
  @Field(() => ESynthiaProjectSynthNodeOscillatorProperties)
  properties: ESynthiaProjectSynthNodeWaveProperties;
}
@ObjectType()
export class ESynthiaProjectSynthNodeReverb extends ESynthiaProjectSynthNodeBase {
  @Field(() => SynthNodeTypeEnum)
  type: "reverb";
  @Field(() => ESynthiaProjectSynthNodeOscillatorProperties)
  properties: ESynthiaProjectSynthNodeReverbProperties;
}
@ObjectType()
export class ESynthiaProjectSynthNodeDelay extends ESynthiaProjectSynthNodeBase {
  @Field(() => SynthNodeTypeEnum)
  type: "delay";
  @Field(() => ESynthiaProjectSynthNodeOscillatorProperties)
  properties: ESynthiaProjectSynthNodeDelayProperties;
}
@ObjectType()
export class ESynthiaProjectSynthNodeFilter extends ESynthiaProjectSynthNodeBase {
  @Field(() => SynthNodeTypeEnum)
  type: "filter";
  @Field(() => ESynthiaProjectSynthNodeOscillatorProperties)
  properties: ESynthiaProjectSynthNodeFilterProperties;
}
@ObjectType()
export class ESynthiaProjectSynthNodePan extends ESynthiaProjectSynthNodeBase {
  @Field(() => SynthNodeTypeEnum)
  type: "pan";
  @Field(() => ESynthiaProjectSynthNodeOscillatorProperties)
  properties: ESynthiaProjectSynthNodePanProperties;
}

export const SynthNodeUnion: TSynthiaProjectSynthNode = createUnionType({
  name: 'SynthNode',
  types: [
    ESynthiaProjectSynthNodeOscillator,
    ESynthiaProjectSynthNodeWave,
    ESynthiaProjectSynthNodeReverb,
    ESynthiaProjectSynthNodeDelay,
    ESynthiaProjectSynthNodeFilter,
    ESynthiaProjectSynthNodePan
  ],
  resolveType: (value: any) => {
    switch (value.type) {
      case SynthNodeTypeEnum.oscillator:
        return ESynthiaProjectSynthNodeOscillator;
      case SynthNodeTypeEnum.wave:
        return ESynthiaProjectSynthNodeWave;
      case SynthNodeTypeEnum.reverb:
        return ESynthiaProjectSynthNodeReverb;
      case SynthNodeTypeEnum.delay:
        return ESynthiaProjectSynthNodeDelay;
      case SynthNodeTypeEnum.filter:
        return ESynthiaProjectSynthNodeFilter;
      case SynthNodeTypeEnum.pan:
        return ESynthiaProjectSynthNodePan;
      default:
        return undefined;
    }
  }
});
