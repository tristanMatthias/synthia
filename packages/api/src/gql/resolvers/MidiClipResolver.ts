import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';

import { Context } from '../../lib/context';
import { MidiClip } from '../../models/MidiClip';
import { MidiClipService } from '../../services/MidiClipService';
import { UserService } from '../../services/UserService';
import { ECreateMidiClip, EMidiClip, EUpdateMidiClip } from '../entities/MidiClipEntity';
import { EProject } from '../entities/ProjectEntity';
import { EUser } from '../entities/UserEntity';


@Resolver(EMidiClip)
export class MidiClipResolver {

  @Authorized()
  @Query(() => EMidiClip)
  async midiClip(@Arg('id') id: string) {
    return MidiClipService.findById(id);
  }

  @Authorized()
  @Query(() => [EMidiClip])
  async midiClips(
    @Ctx() { user }: Context
  ) {
    return MidiClipService.myMidiClips(user!.id);;
  }

  @Authorized()
  @Mutation(() => EMidiClip)
  async createMidiClip(
    @Arg('midiClip') midiClip: ECreateMidiClip,
    @Ctx() { user }: Context
  ) {
    return MidiClipService.createMidiClip(midiClip, user!.id);;
  }

  @Authorized()
  @Mutation(() => EMidiClip)
  async updateMidiClip(
    @Arg('midiClip') midiClip: EUpdateMidiClip,
    @Ctx() { user }: Context
  ) {
    return MidiClipService.updateMidiClip(midiClip, user!.id);;
  }

  // ---------------------------------------------------------------------------
  // -------------------------------------------------------------------- Fields
  // ---------------------------------------------------------------------------
  @FieldResolver(() => EUser)
  async creator(
    @Root() midiClip: MidiClip
  ) {
    return await UserService.findById(midiClip.creatorId)
  }

  @FieldResolver(() => [EProject])
  async projects(
    @Root() midiClip: MidiClip
  ) {
    return await midiClip.$get('projects');
  }
}
