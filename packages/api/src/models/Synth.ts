import { JSON } from 'sequelize';
import { BelongsToMany, Column, Default, Table } from 'sequelize-typescript';

import { TSynthiaProjectSynthNode } from '../gql/entities/SynthNodeEntity';
import { WithMetadata } from './WithMetadata';
import { Project } from './Project';
import { ProjectSynth } from './ProjectSynth';


@Table
export class Synth extends WithMetadata<Synth> {
  @Default('[]')
  @Column({type: JSON})
  nodes: TSynthiaProjectSynthNode[];

  @BelongsToMany(() => Project, () => ProjectSynth)
  projects: Project[]
}
