import { JSONB } from 'sequelize';
import { BelongsTo, Column, Default, ForeignKey, Table } from 'sequelize-typescript';

import { EAudioTrackClip } from '../gql/entities/AudioTrackEntity';
import { BaseModel } from './BaseModel';
import { Project } from './Project';
import { Synth } from './Synth';


@Table
export class AudioTrack extends BaseModel<AudioTrack> {
  @ForeignKey(() => Project)
  @Column
  projectId: string;

  @Default('Audio Track')
  @Column
  name: string;

  @Default([])
  @Column({ type: JSONB })
  audioClips: EAudioTrackClip[];

  @ForeignKey(() => Synth)
  @Column
  instrumentId: string;

  @BelongsTo(() => Project)
  project: Project;
}
