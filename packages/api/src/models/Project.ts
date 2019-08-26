import { BelongsToMany, HasMany, Table } from 'sequelize-typescript';
import { MidiTrack } from './MidiTrack';
import { ProjectSynth } from './ProjectSynth';
import { Synth } from './Synth';
import { WithMetadata } from './WithMetadata';



@Table
export class Project extends WithMetadata<Project> {

  @BelongsToMany(() => Synth, () => ProjectSynth)
  synths: Synth[]

  @HasMany(() => MidiTrack)
  midiTracks: MidiTrack[]
}

