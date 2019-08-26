import { EMetadata } from '../gql/entities/MetadataEntity';
import { ECreateProject, EUpdateProject } from '../gql/entities/ProjectEntity';
import { ErrorResourceNotPublic, handleSequelizeError } from '../lib/errors';
import { Project } from '../models/Project';
import { BaseService } from './BaseService';
import { SynthService } from './SynthService';
import { UserService } from './UserService';

export interface UpdateProject extends ECreateProject {
  id: string;
}
export interface GetProject {
  id: string;
}

export const ProjectService = new class extends BaseService<
  Project,
  EMetadata,
  UpdateProject,
  GetProject
  > {

  async findPublicById(id: string) {
    const pj = (await this.findById(id))!;
    if (pj.public) throw new ErrorResourceNotPublic('project');
    return pj;
  }

  async myProjects(userId: string) {
    const user = (await UserService.findById(userId))!;
    return await user.$get('projects');
  }

  async createProject(project: ECreateProject, userId: string) {
    try {
      return await Project.create({ ...project, creatorId: userId });
    } catch (e) {
      throw await handleSequelizeError(e);
    }
  }

  async createDefault(userId: string) {
    const pj = await this.createProject({
      name: 'My first Synthia project',
      public: true
    }, userId);

    await SynthService.createSynth({
      name: 'My Synth',
      projectId: pj.id,
      public: true
    }, userId);

    return pj;
  }

  async mostRecent(userId: string) {
    try {
      return await Project.findOne({
        where: { creatorId: userId },
        order: [['updatedAt', 'DESC']]
      });
    } catch (e) {
      throw await handleSequelizeError(e);
    }
  }

  async updateProject(project: EUpdateProject) {
    const pj = await this.findById(project.id);

    try {
      return await pj!.update({ ...project });
    } catch (e) {
      throw await handleSequelizeError(e);
    }
  }

}(Project)
