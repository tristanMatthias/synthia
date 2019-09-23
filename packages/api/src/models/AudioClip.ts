import { FLOAT } from 'sequelize';
import { AllowNull, BelongsTo, BelongsToMany, Column, Default, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from './BaseModel';
import { Project } from './Project';
import { ProjectAudioClip } from './ProjectAudioClip';
import { User } from './User';



@Table
export class AudioClip extends BaseModel<AudioClip> {

  @Default('Audio Clip')
  @Column
  name: string;

  @AllowNull(false)
  @Default(1)
  @Column({ type: FLOAT })
  duration: number;

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

  @AllowNull(false)
  @Column({ unique: true })
  url: string;

  @BelongsToMany(() => Project, () => ProjectAudioClip)
  projects: Project[]
}
