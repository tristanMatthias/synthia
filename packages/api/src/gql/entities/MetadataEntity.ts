import { Field, InputType, ObjectType } from 'type-graphql';

@ObjectType()
export class EMetadata {
  @Field()
  name: string;

  @Field()
  public: boolean;

  @Field()
  creatorId: string;

  @Field()
  createdAt: Date;
}

@InputType()
export class EMetadataInput {
  @Field({nullable: true})
  name?: string;

  @Field({nullable: true})
  public?: boolean;
}
