import { Field, InputType, ObjectType } from 'type-graphql';

import { EAudioClip } from './AudioClipEntity';
import { EAudioTrack } from './AudioTrackEntity';
import { EMetadata } from './MetadataEntity';
import { EMidiClip } from './MidiClipEntity';
import { EMidiTrack } from './MidiTrackEntity';
import { ESynth } from './SynthEntity';
import { EUser } from './UserEntity';


@ObjectType()
export class EProjectResources {

  @Field(() => [ESynth])
  synths: ESynth[];

  @Field(() => [EMidiClip])
  midiClips: EMidiClip[]

  @Field(() => [EAudioClip])
  audioClips: EAudioClip[]
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

  @Field(() => [EAudioTrack])
  audioTracks: EAudioTrack[]
}


@InputType()
export class ECreateProject {
  @Field()
  name: string;

  @Field({ nullable: true })
  public?: boolean;
}

@InputType()
export class EUpdateProject {
  @Field()
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  public?: boolean;
}
