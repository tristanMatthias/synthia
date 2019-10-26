import { EMetadata } from '../gql/entities/MetadataEntity';
import { ECreateAudioTrack, EUpdateAudioTrack } from '../gql/entities/AudioTrackEntity';
import { handleSequelizeError } from '../lib/errors';
import { AudioTrack } from '../models/AudioTrack';
import { BaseService } from './BaseService';
import { ProjectService } from './ProjectService';

export interface UpdateAudioTrack extends ECreateAudioTrack {
  id: string;
}
export interface GetAudioTrack {
  id: string;
}

export const AudioTrackService = new class extends BaseService<
  AudioTrack,
  EMetadata,
  UpdateAudioTrack,
  GetAudioTrack
  > {

  async createAudioTrack(track: ECreateAudioTrack) {
    const { projectId, name } = track;
    const pj = (await ProjectService.findById(projectId))!;

    try {
      return await pj!.$create('audioTrack', { name }) as AudioTrack;
    } catch (e) {
      throw await handleSequelizeError(e);
    }
  }

  async updateAudioTrack(track: EUpdateAudioTrack) {
    const t = (await this.findById(track.id))!;

    try {
      return await t.update(track);
    } catch (e) {
      throw await handleSequelizeError(e);
    }
  }

}(AudioTrack)
