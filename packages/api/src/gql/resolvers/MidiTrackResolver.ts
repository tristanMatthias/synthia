import { Arg, Authorized, Mutation, Resolver } from 'type-graphql';

import { MidiTrack } from '../../models/MidiTrack';
import { MidiTrackService } from '../../services/MidiTrackService';
import { ECreateMidiTrack, EMidiTrack, EUpdateMidiTrack } from '../entities/MidiTrackEntity';



@Resolver(EMidiTrack)
export class MidiTrackResolver {

  @Authorized()
  @Mutation(() => EMidiTrack)
  async createMidiTrack(
    @Arg('midiTrack') midiTrack: ECreateMidiTrack
  ): Promise<MidiTrack> {
    return MidiTrackService.createMidiTrack(midiTrack);
  }

  @Authorized()
  @Mutation(() => EMidiTrack)
  async updateMidiTrack(
    @Arg('midiTrack') midiTrack: EUpdateMidiTrack
  ): Promise<MidiTrack> {
    return MidiTrackService.updateMidiTrack(midiTrack);
  }
}
