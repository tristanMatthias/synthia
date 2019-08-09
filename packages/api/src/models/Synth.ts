import { JSON } from 'sequelize';
import { BelongsToMany, Column, Table, Default } from 'sequelize-typescript';

import { SynthiaProjectSynthNode } from '../types/SynthiaProject';
import { WithMetadata } from './BaseModel';
import { Project } from './Project';
import { ProjectSynth } from './ProjectSynth';


@Table
export class Synth extends WithMetadata<Synth> {
  @Default('[]')
  @Column({type: JSON})
  nodes: SynthiaProjectSynthNode[];

  @BelongsToMany(() => Project, () => ProjectSynth)
  projects: Project[]
}
