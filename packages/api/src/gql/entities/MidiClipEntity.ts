import { Field, ObjectType, InputType } from 'type-graphql';

@ObjectType()
export class EMidiClip {
  @Field()
  id: string;

  @Field()
  duration: number;

  @Field({nullable: true})
  name: string;

  @Field()
  public: boolean;

  @Field()
  creatorId: string;

  @Field()
  createdAt: Date;

  @Field(() => [EMidiClipNote])
  notes: EMidiClipNote[];
}

@InputType('EMidiClipNoteInput')
@ObjectType()
export class EMidiClipNote {
  @Field({description: 'Start'})
  s: number;

  @Field({description: 'Duration'})
  d: number;

  @Field({description: 'Velocity'})
  v: number;

  @Field({description: 'Note'})
  n: string;
}


@InputType()
export class ECreateMidiClip {
  @Field()
  projectId: string;

  @Field({ nullable: true })
  name?: string;

  @Field({nullable: true})
  duration?: number;

  @Field(() => [EMidiClipNote], { nullable: true })
  notes?: EMidiClipNote[];
}

@InputType()
export class EUpdateMidiClip {
  @Field()
  id: string;

  @Field({ nullable: true })
  duration?: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  public?: boolean;

  @Field(() => [EMidiClipNote], {nullable: true})
  notes?: EMidiClipNote[]
}
