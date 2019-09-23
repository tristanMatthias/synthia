import { AllowNull, Column, ForeignKey, Table } from 'sequelize-typescript';

import { BaseModel } from './BaseModel';
import { Project } from './Project';
import { AudioClip } from './AudioClip';

@Table
export class ProjectAudioClip extends BaseModel<ProjectAudioClip> {

  @ForeignKey(() => Project)
  @AllowNull(false)
  @Column({ unique: 'project_audio_clip' })
  projectId: string;

  @ForeignKey(() => AudioClip)
  @AllowNull(false)
  @Column({ unique: 'project_audio_clip' })
  audioClipId: string;
}
