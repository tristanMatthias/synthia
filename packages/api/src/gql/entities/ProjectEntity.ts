import { Field, InputType, ObjectType } from 'type-graphql';

import { EMetadata } from './MetadataEntity';
import { ESynth } from './SynthEntity';
import { EUser } from './UserEntity';
import { EMidiClip } from './MidiClipEntity';
import { EMidiTrack } from './MidiTrackEntity';


@ObjectType()
export class EProjectResources {

  @Field(() => [ESynth])
  synths: ESynth[];

  @Field(()=> [EMidiClip])
  midiClips: EMidiClip[]
}


@ObjectType()
export class EProject extends EMetadata {
  @Field()
  id: string;

  @Field(() => EUser)
  creator: EUser;

  @Field(() => EProjectResources)
  resources: EProjectResources;

  @Field(() => [EMidiTrack])
  midiTracks: EMidiTrack[]
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
