import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Context } from '../../lib/context';
import { Project } from '../../models/Project';
import { ProjectService } from '../../services/ProjectService';
import { SynthService } from '../../services/SynthService';
import { ECreateProject, EProject, EProjectResources } from '../entities/ProjectEntity';
import { EUser } from '../entities/UserEntity';


@Resolver(EProject)
export class ProjectResolver {

  @Authorized()
  @Query(() => EProject)
  async project(@Arg('projectId') id: string) {
    return ProjectService.findById(id);
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
  ) {
    const synths = await SynthService.findByProject(project.id)
    return { synths }
  }
}
