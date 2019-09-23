import { Field, ObjectType, InputType } from 'type-graphql';

@ObjectType()
export class EAudioTrack {
  @Field()
  id: string;

  @Field()
  projectId: string;

  @Field()
  name: string;

  @Field(() => [EAudioTrackClip])
  audioClips: EAudioTrackClip[]

  @Field({ nullable: true })
  instrumentId?: string;
}

@InputType('EAudioTrackClipInput')
@ObjectType()
export class EAudioTrackClip {
  @Field()
  clipId: string;

  @Field()
  start: number;

  @Field()
  duration: number;
}

@InputType()
export class ECreateAudioTrack {
  @Field()
  projectId: string;

  @Field({ nullable: true })
  name: string;
}

@InputType()
export class EUpdateAudioTrack {
  @Field()
  id: string;

  @Field(() => [EAudioTrackClip], { nullable: true })
  audioClips: EAudioTrackClip[]

  @Field({ nullable: true })
  instrumentId: string;

  @Field({ nullable: true })
  name: string;
}
