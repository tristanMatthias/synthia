import { Field, ObjectType, InputType } from 'type-graphql';

@ObjectType()
export class EMidiTrack {
  @Field()
  id: string;

  @Field()
  projectId: string;

  @Field()
  name: string;

  @Field(() => [EMidiTrackClip])
  midiClips: EMidiTrackClip[]

  @Field({nullable: true})
  instrumentId?: string;
}

@InputType('EMidiTrackClipInput')
@ObjectType()
export class EMidiTrackClip {
  @Field()
  clipId: string;

  @Field()
  start: number;

  @Field()
  duration: number;
}

@InputType()
export class ECreateMidiTrack {
  @Field()
  projectId: string;

  @Field({ nullable: true })
  name: string;
}

@InputType()
export class EUpdateMidiTrack {
  @Field()
  id: string;

  @Field(() => [EMidiTrackClip], {nullable: true})
  midiClips: EMidiTrackClip[]

  @Field({ nullable: true })
  instrumentId: string;

  @Field({ nullable: true })
  name: string;
}
