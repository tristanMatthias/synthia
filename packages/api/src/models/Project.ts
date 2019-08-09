import { BelongsToMany, Table } from 'sequelize-typescript';

import { WithMetadata } from './BaseModel';
import { ProjectSynth } from './ProjectSynth';
import { Synth } from './Synth';


@Table
export class Project extends WithMetadata<Project> {

  @BelongsToMany(() => Synth, () => ProjectSynth)
  synths: Synth[]
}
