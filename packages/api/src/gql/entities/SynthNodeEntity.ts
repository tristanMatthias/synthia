import { createUnionType, Field, ObjectType, registerEnumType } from 'type-graphql';

import { SynthiaProjectSynthNodeType } from '../../types/index';
import { EPosition } from './SynthEntity';
import {
  ESynthiaProjectSynthNodeDelayProperties,
  ESynthiaProjectSynthNodeFilterProperties,
  ESynthiaProjectSynthNodeOscillatorProperties,
  ESynthiaProjectSynthNodePanProperties,
  ESynthiaProjectSynthNodeReverbProperties,
  ESynthiaProjectSynthNodeWaveProperties,
} from './SynthNodeProperties';

export const TSynthNodeType = registerEnumType(SynthiaProjectSynthNodeType, {
  name: "SynthNodeType"
});


@ObjectType()
class ESynthiaProjectSynthNodeBase {
  @Field()
  id: string;

  @Field(() => SynthiaProjectSynthNodeType)
  type: SynthiaProjectSynthNodeType;

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
  @Field(() => SynthiaProjectSynthNodeType)
  type: SynthiaProjectSynthNodeType.oscillator
  @Field(() => ESynthiaProjectSynthNodeOscillatorProperties)
  properties: ESynthiaProjectSynthNodeOscillatorProperties;
}
@ObjectType()
export class ESynthiaProjectSynthNodeWave extends ESynthiaProjectSynthNodeBase {
  @Field(() => SynthiaProjectSynthNodeType)
  type: SynthiaProjectSynthNodeType.wave
  @Field(() => ESynthiaProjectSynthNodeWaveProperties)
  properties: ESynthiaProjectSynthNodeWaveProperties;
}
@ObjectType()
export class ESynthiaProjectSynthNodeReverb extends ESynthiaProjectSynthNodeBase {
  @Field(() => SynthiaProjectSynthNodeType)
  type: SynthiaProjectSynthNodeType.reverb
  @Field(() => ESynthiaProjectSynthNodeReverbProperties)
  properties: ESynthiaProjectSynthNodeReverbProperties;
}
@ObjectType()
export class ESynthiaProjectSynthNodeDelay extends ESynthiaProjectSynthNodeBase {
  @Field(() => SynthiaProjectSynthNodeType)
  type: SynthiaProjectSynthNodeType.delay
  @Field(() => ESynthiaProjectSynthNodeDelayProperties)
  properties: ESynthiaProjectSynthNodeDelayProperties;
}
@ObjectType()
export class ESynthiaProjectSynthNodeFilter extends ESynthiaProjectSynthNodeBase {
  @Field(() => SynthiaProjectSynthNodeType)
  type: SynthiaProjectSynthNodeType.filter
  @Field(() => ESynthiaProjectSynthNodeFilterProperties)
  properties: ESynthiaProjectSynthNodeFilterProperties;
}
@ObjectType()
export class ESynthiaProjectSynthNodePan extends ESynthiaProjectSynthNodeBase {
  @Field(() => SynthiaProjectSynthNodeType)
  type: SynthiaProjectSynthNodeType.pan
  @Field(() => ESynthiaProjectSynthNodePanProperties)
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
    switch(value.type) {
      case SynthiaProjectSynthNodeType.oscillator:
        return ESynthiaProjectSynthNodeOscillator;
      case SynthiaProjectSynthNodeType.wave:
        return ESynthiaProjectSynthNodeWave;
      case SynthiaProjectSynthNodeType.reverb:
        return ESynthiaProjectSynthNodeReverb;
      case SynthiaProjectSynthNodeType.delay:
        return ESynthiaProjectSynthNodeDelay;
      case SynthiaProjectSynthNodeType.filter:
        return ESynthiaProjectSynthNodeFilter;
      case SynthiaProjectSynthNodeType.pan:
        return ESynthiaProjectSynthNodePan;
      default:
        return undefined;
    }
  }
});
