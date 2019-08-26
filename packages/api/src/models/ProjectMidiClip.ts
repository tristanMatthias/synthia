import { AllowNull, Column, ForeignKey, Table } from 'sequelize-typescript';

import { BaseModel } from './BaseModel';
import { Project } from './Project';
import { MidiClip } from './MidiClip';

@Table
export class ProjectMidiClip extends BaseModel<ProjectMidiClip> {

  @ForeignKey(() => Project)
  @AllowNull(false)
  @Column({ unique: 'project_midi_clip' })
  projectId: string;

  @ForeignKey(() => MidiClip)
  @AllowNull(false)
  @Column({ unique: 'project_midi_clip'})
  midiClipId: string;
}
