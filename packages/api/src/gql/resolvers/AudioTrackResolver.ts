import { Arg, Authorized, Mutation, Resolver } from 'type-graphql';

import { AudioTrack } from '../../models/AudioTrack';
import { AudioTrackService } from '../../services/AudioTrackService';
import { ECreateAudioTrack, EAudioTrack, EUpdateAudioTrack } from '../entities/AudioTrackEntity';



@Resolver(EAudioTrack)
export class AudioTrackResolver {

  @Authorized()
  @Mutation(() => EAudioTrack)
  async createAudioTrack(
    @Arg('audioTrack') audioTrack: ECreateAudioTrack
  ): Promise<AudioTrack> {
    return AudioTrackService.createAudioTrack(audioTrack);
  }

  @Authorized()
  @Mutation(() => EAudioTrack)
  async updateAudioTrack(
    @Arg('audioTrack') audioTrack: EUpdateAudioTrack
  ): Promise<AudioTrack> {
    return AudioTrackService.updateAudioTrack(audioTrack);
  }
}
