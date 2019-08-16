import { AllowNull, BelongsTo, Column, Default, ForeignKey, IsDate, Model, PrimaryKey } from 'sequelize-typescript';
import shortid from 'shortid';

import { User } from './User';



export class BaseModel<T extends Model<T>> extends Model<T> {
  // Setup the primary key
  @PrimaryKey
  @Default(() => shortid())
  @Column
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


