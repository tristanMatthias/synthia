import { GraphQLJSONObject } from 'graphql-type-json';
import { Field, InputType, ObjectType } from 'type-graphql';

import { EMetadata, EMetadataInput } from './MetadataEntity';
import { SynthNodeUnion } from './SynthNodeEntity';
import { SynthiaProjectSynthNodeProperties } from './SynthNodeProperties';


@ObjectType()
export class ESynth extends EMetadata {
  @Field()
  id: string;

  @Field(() => [SynthNodeUnion], {nullable: true})
  nodes: (typeof SynthNodeUnion)[]
}


@InputType()
export class ECreateSynth extends EMetadataInput {
  @Field(() => [ESynthNodeInput], { nullable: true })
  nodes?: ESynthNodeInput[]

  @Field({ nullable: true })
  projectId?: string;
}

@InputType()
export class EUpdateSynth extends EMetadataInput {
  @Field()
  id: string;

  @Field(() => [ESynthNodeInput], { nullable: true })
  nodes: ESynthNodeInput[]
}


@ObjectType()
export class EPosition {
  @Field()
  x: number;

  @Field()
  y: number;
}

@InputType()
export class EPositionInput {
  @Field()
  x: number;

  @Field()
  y: number;
}

@InputType()
export class ESynthNodeInput {
  @Field()
  id: string;

  @Field()
  type: string;

  @Field(() => [String])
  connectedTo: string[];

  @Field(() => [String])
  receives: string[];

  @Field(() => EPositionInput)
  position: EPositionInput;

  @Field(() => GraphQLJSONObject)
  properties: SynthiaProjectSynthNodeProperties;
}
