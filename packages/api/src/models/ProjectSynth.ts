import { AllowNull, Column, ForeignKey, Table } from 'sequelize-typescript';

import { BaseModel } from './BaseModel';
import { Project } from './Project';
import { Synth } from './Synth';

@Table
export class ProjectSynth extends BaseModel<ProjectSynth> {

  @ForeignKey(() => Project)
  @AllowNull(false)
  @Column({ unique: 'project_synth' })
  projectId: string;

  @ForeignKey(() => Synth)
  @AllowNull(false)
  @Column({ unique: 'project_synth'})
  synthId: string;

  // @BelongsTo(() => Synth)
  // synth: Synth;

  // @BelongsTo(() => Project)
  // project: Project;
}
