import { UUIDV4 } from 'sequelize';
import { AllowNull, BelongsTo, Column, Default, ForeignKey, IsUUID, Model, PrimaryKey, IsDate } from 'sequelize-typescript';
import { User } from './User';



export class BaseModel<T extends Model<T>> extends Model<T> {
  // Setup the primary key
  @PrimaryKey
  @IsUUID(4)
  @Column({ defaultValue: UUIDV4 })
  id: string;

  @IsDate
  @Column
  createdAt: Date
}

export class WithMetadata<T extends BaseModel<T>> extends BaseModel<T> {

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Default(true)
  @Column
  public: boolean;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  creatorId: string;

  @BelongsTo(() => User)
  creator: User;
}


