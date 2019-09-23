import { Field, ObjectType, InputType } from 'type-graphql';
import { GraphQLUpload } from 'graphql-upload';
import { Upload } from '../../types/types';

@ObjectType()
export class EAudioClip {
  @Field()
  id: string;

  @Field()
  duration: number;

  @Field({ nullable: true })
  name: string;

  @Field()
  public: boolean;

  @Field()
  creatorId: string;

  @Field()
  createdAt: Date;

  @Field()
  url: string;
}


@InputType()
export class ECreateAudioClip {
  @Field()
  projectId: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  duration?: number;

  @Field(() => GraphQLUpload, { nullable: true })
  file: Upload;
}


@InputType()
export class EUpdateAudioClip {
  @Field()
  id: string;

  @Field({ nullable: true })
  duration?: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  public?: boolean;

  @Field(() => GraphQLUpload, { nullable: true })
  file: Upload;
}
