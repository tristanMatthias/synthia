import { Column, Table, IsEmail, AllowNull, HasMany } from 'sequelize-typescript';

import { BaseModel } from './BaseModel';
import { Project } from './Project';


@Table
export class User extends BaseModel<User> {

  @AllowNull(false)
  @Column
  firstName: string;

  @AllowNull(false)
  @Column
  lastName: string;

  @IsEmail
  @AllowNull(false)
  @Column
  email: string;

  @AllowNull(false)
  @Column
  socialId: string;

  @AllowNull(false)
  @Column
  socialPic: string;

  // ------------------------------------------------------------- Relationships
  @HasMany(() => Project)
  projects: Project[]
}
