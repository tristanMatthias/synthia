import { JSONB } from 'sequelize';
import { BelongsTo, Column, Default, ForeignKey, Table } from 'sequelize-typescript';

import { EMidiTrackClip } from '../gql/entities/MidiTrackEntity';
import { BaseModel } from './BaseModel';
import { Project } from './Project';
import { Synth } from './Synth';


@Table
export class MidiTrack extends BaseModel<MidiTrack> {
  @ForeignKey(() => Project)
  @Column
  projectId: string;

  @Default([])
  @Column({ type: JSONB })
  midiClips: EMidiTrackClip[];

  @ForeignKey(() => Synth)
  @Column
  instrumentId: string;

  @BelongsTo(() => Project)
  project: Project;
}
