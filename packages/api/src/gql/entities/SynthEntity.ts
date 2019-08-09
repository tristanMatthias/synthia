import { Field, InputType, ObjectType } from 'type-graphql';

import { SynthiaProjectSynthNodeBase } from '../../types/SynthiaProject';
import { EMetadata, EMetadataInput } from './MetadataEntity';


@ObjectType()
export class ESynth extends EMetadata {
  @Field()
  id: string;

  @Field(() => [ESynthNode], {nullable: true})
  nodes: ESynthNode[]
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


@ObjectType()
export class ESynthNode implements SynthiaProjectSynthNodeBase {
  @Field()
  id: string;

  @Field(() => [String])
  connectedTo: string[];

  @Field(() => [String])
  receives: string[];

  @Field(() => EPosition)
  position: EPosition;
}

@InputType()
export class ESynthNodeInput implements SynthiaProjectSynthNodeBase {
  @Field()
  id: string;

  @Field(() => [String])
  connectedTo: string[];

  @Field(() => [String])
  receives: string[];

  @Field(() => EPositionInput)
  position: EPositionInput;
}
