import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';

import { Context } from '../../lib/context';
import { ErrorAuthNoAccess, ErrorResourceNotPublic } from '../../lib/errors';
import { Project } from '../../models/Project';
import { MidiClipService } from '../../services/MidiClipService';
import { ProjectService } from '../../services/ProjectService';
import { SynthService } from '../../services/SynthService';
import { EMidiTrack } from '../entities/MidiTrackEntity';
import { ECreateProject, EProject, EProjectResources, EUpdateProject } from '../entities/ProjectEntity';
import { EUser } from '../entities/UserEntity';


@Resolver(EProject)
export class ProjectResolver {

  @Query(() => EProject)
  async project(
    @Arg('projectId') id: string,
    @Ctx() { user }: Context
  ) {
    const pj = (await ProjectService.findById(id))!;
    // If public, return it for everyone
    if (pj.public) return pj;
    // If not logged in and it's private, throw not public
    if (!user) throw new ErrorResourceNotPublic('project');
    // If not public, and user is logged in but not creator, throw no access
    if (pj.creatorId !== user.id) throw new ErrorAuthNoAccess('project');
    // If not public, user logged in, and user is creator, return it
    return pj;
  }

  @Authorized()
  @Query(() => [EProject])
  async projects(
    @Ctx() {user}: Context
  ) {
    return ProjectService.myProjects(user!.id);;
  }

  @Authorized()
  @Mutation(() => EProject)
  async createProject(
    @Arg('project') project: ECreateProject,
    @Ctx() {user}: Context
  ): Promise<Project> {
    return ProjectService.createProject(project, user!.id);;
  }

  @Authorized()
  @Mutation(() => EProject)
  async updateProject(
    @Arg('project') project: EUpdateProject
  ): Promise<Project> {
    return ProjectService.updateProject(project);;
  }

  @Authorized()
  @Query(() => EProject, {nullable: true})
  async mostRecentProject(
    @Ctx() {user}: Context
  ): Promise<Project | null> {
    return ProjectService.mostRecent(user!.id);;
  }

  // ---------------------------------------------------------------------------
  // -------------------------------------------------------------------- Fields
  // ---------------------------------------------------------------------------
  @FieldResolver(() => EUser)
  async creator(
    @Root() project: Project
  ) {
    return await project.$get('creator');
  }

  @FieldResolver(() => EProjectResources)
  async resources(
    @Root() project: Project
  ): Promise<EProjectResources> {
    const synths = await SynthService.findByProject(project.id);
    const midiClips = await MidiClipService.findByProject(project.id);
    return { synths, midiClips }
  }

  @FieldResolver(() => EMidiTrack)
  async midiTracks(
    @Root() project: Project
  ) {
    return await project.$get('midiTracks');
  }
}
