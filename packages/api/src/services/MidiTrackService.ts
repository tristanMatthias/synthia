import { EMetadata } from '../gql/entities/MetadataEntity';
import { ECreateMidiTrack, EUpdateMidiTrack } from '../gql/entities/MidiTrackEntity';
import { handleSequelizeError } from '../lib/errors';
import { MidiTrack } from '../models/MidiTrack';
import { BaseService } from './BaseService';
import { ProjectService } from './ProjectService';

export interface UpdateMidiTrack extends ECreateMidiTrack {
  id: string;
}
export interface GetMidiTrack {
  id: string;
}

export const MidiTrackService = new class extends BaseService<
  MidiTrack,
  EMetadata,
  UpdateMidiTrack,
  GetMidiTrack
  > {

  async createMidiTrack(track: ECreateMidiTrack) {
    const pj = (await ProjectService.findById(track.projectId))!;

    try {
      await pj!.$create('midiTrack', {});
      return pj;
    } catch (e) {
      throw await handleSequelizeError(e);
    }
  }

  async updateMidiTrack(track: EUpdateMidiTrack) {
    const t = (await this.findById(track.id))!;

    try {
      return await t.update(track);
    } catch (e) {
      throw await handleSequelizeError(e);
    }
  }

}(MidiTrack)
