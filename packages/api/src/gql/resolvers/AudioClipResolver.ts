import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';

import { Context } from '../../lib/context';
import { AudioClip } from '../../models/AudioClip';
import { AudioClipService } from '../../services/AudioClipService';
import { UserService } from '../../services/UserService';
import { ECreateAudioClip, EAudioClip, EUpdateAudioClip } from '../entities/AudioClipEntity';
import { EProject } from '../entities/ProjectEntity';
import { EUser } from '../entities/UserEntity';


@Resolver(EAudioClip)
export class AudioClipResolver {

  @Authorized()
  @Query(() => EAudioClip)
  async audioClip(@Arg('id') id: string) {
    return AudioClipService.findById(id);
  }

  @Authorized()
  @Query(() => [EAudioClip])
  async audioClips(
    @Ctx() { user }: Context
  ) {
    return AudioClipService.myAudioClips(user!.id);;
  }

  @Authorized()
  @Mutation(() => EAudioClip)
  async createAudioClip(
    @Arg('audioClip') audioClip: ECreateAudioClip,
    @Ctx() { user }: Context
  ) {
    return AudioClipService.createAudioClip(audioClip, user!.id);;
  }

  @Authorized()
  @Mutation(() => EAudioClip)
  async updateAudioClip(
    @Arg('audioClip') audioClip: EUpdateAudioClip,
    @Ctx() { user }: Context
  ) {
    return AudioClipService.updateAudioClip(audioClip, user!.id);;
  }

  // ---------------------------------------------------------------------------
  // -------------------------------------------------------------------- Fields
  // ---------------------------------------------------------------------------
  @FieldResolver(() => EUser)
  async creator(
    @Root() audioClip: AudioClip
  ) {
    return await UserService.findById(audioClip.creatorId)
  }

  @FieldResolver(() => [EProject])
  async projects(
    @Root() audioClip: AudioClip
  ) {
    return await audioClip.$get('projects');
  }
}
