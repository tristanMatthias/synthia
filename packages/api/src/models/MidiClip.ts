import { JSONB, FLOAT } from 'sequelize';
import { AllowNull, BelongsTo, BelongsToMany, Column, Default, ForeignKey, Table } from 'sequelize-typescript';

import { EMidiClipNote } from '../gql/entities/MidiClipEntity';
import { BaseModel } from './BaseModel';
import { Project } from './Project';
import { ProjectMidiClip } from './ProjectMidiClip';
import { User } from './User';


@Table
export class MidiClip extends BaseModel<MidiClip> {

  @Default('Midi Clip')
  @Column
  name: string;

  @AllowNull(false)
  @Default(1)
  @Column({type: FLOAT})
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

  @Default([])
  @Column({ type: JSONB })
  notes: EMidiClipNote[];

  @BelongsToMany(() => Project, () => ProjectMidiClip)
  projects: Project[]
}
