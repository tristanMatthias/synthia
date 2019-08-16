import { Field, InputType, ObjectType } from 'type-graphql';

import { EMetadata } from './MetadataEntity';
import { ESynth } from './SynthEntity';
import { EUser } from './UserEntity';


@ObjectType()
export class EProjectResources {

  @Field(() => [ESynth])
  synths: ESynth[];
}

@ObjectType()
export class EProject extends EMetadata {
  @Field()
  id: string;

  @Field(() => EProjectResources)
  resources: EProjectResources;

  @Field(() => EUser)
  creator: EUser;
}


@InputType()
export class ECreateProject {
  @Field()
  name: string;

  @Field({nullable: true})
  public?: boolean;
}

@InputType()
export class EUpdateProject {
  @Field()
  id: string;

  @Field({nullable: true})
  name: string;

  @Field({nullable: true})
  public?: boolean;
}
