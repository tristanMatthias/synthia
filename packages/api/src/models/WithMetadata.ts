import { AllowNull, BelongsTo, Column, Default, ForeignKey } from 'sequelize-typescript';

import { BaseModel } from './BaseModel';
import { User } from './User';

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
