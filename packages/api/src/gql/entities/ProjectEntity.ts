import { Field, InputType, ObjectType } from 'type-graphql';

import { EMetadata } from './MetadataEntity';
import { ESynth } from './SynthEntity';


@ObjectType()
export class EProjectResources {

  @Field(() => [ESynth])
  synths: ESynth[]
}

@ObjectType()
export class EProject extends EMetadata {
  @Field()
  id: string;
}


@InputType()
export class ECreateProject {
  @Field()
  name: string;

  @Field({nullable: true})
  public?: boolean;
}
