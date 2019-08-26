import { Arg, Authorized, Mutation, Resolver } from 'type-graphql';

import { MidiTrack } from '../../models/MidiTrack';
import { Project } from '../../models/Project';
import { MidiTrackService } from '../../services/MidiTrackService';
import { ECreateMidiTrack, EMidiTrack, EUpdateMidiTrack } from '../entities/MidiTrackEntity';
import { EProject } from '../entities/ProjectEntity';



@Resolver(EMidiTrack)
export class MidiTrackResolver {

  @Authorized()
  @Mutation(() => EProject)
  async createMidiTrack(
    @Arg('track') track: ECreateMidiTrack
  ): Promise<Project> {
    return MidiTrackService.createMidiTrack(track);
  }

  @Authorized()
  @Mutation(() => EMidiTrack)
  async updateMidiTrack(
    @Arg('track') track: EUpdateMidiTrack
  ): Promise<MidiTrack> {
    return MidiTrackService.updateMidiTrack(track);
  }
}
