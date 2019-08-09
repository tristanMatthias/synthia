import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';

import { Context } from '../../lib/context';
import { Synth } from '../../models/Synth';
import { SynthService } from '../../services/SynthService';
import { EProject } from '../entities/ProjectEntity';
import { ECreateSynth, ESynth, EUpdateSynth } from '../entities/SynthEntity';
import { EUser } from '../entities/UserEntity';
import { UserService } from '../../services/UserService';



@Resolver(ESynth)
export class SynthResolver {

  @Authorized()
  @Query(() => ESynth)
  async synth(@Arg('id') id: string) {
    return SynthService.findById(id);
  }

  @Authorized()
  @Query(() => [ESynth])
  async synths(
    @Ctx() { user }: Context
  ) {
    return SynthService.mySynths(user!.id);;
  }

  @Authorized()
  @Mutation(() => ESynth)
  async createSynth(
    @Arg('synth') synth: ECreateSynth,
    @Ctx() { user }: Context
  ) {
    return SynthService.createSynth(synth, user!.id);;
  }

  @Authorized()
  @Mutation(() => ESynth)
  async updateSynth(
    @Arg('synth') synth: EUpdateSynth,
    @Ctx() { user }: Context
  ) {
    return SynthService.updateSynth(synth, user!.id);;
  }

  // ---------------------------------------------------------------------------
  // -------------------------------------------------------------------- Fields
  // ---------------------------------------------------------------------------
  @FieldResolver(() => EUser)
  async creator(
    @Root() synth: Synth
  ) {
    return await UserService.findById(synth.creatorId)
  }

  @FieldResolver(() => [EProject])
  async projects(
    @Root() synth: Synth
  ) {
    return await synth.$get('projects');
  }
}
