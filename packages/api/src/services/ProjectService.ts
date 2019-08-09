import { ECreateProject } from '../gql/entities/ProjectEntity';
import { Project } from '../models/Project';
import { SynthiaProjectMetadata } from '../types/SynthiaProject';
import { BaseService } from './BaseService';
import { UserService } from './UserService';
import { handleSequelizeError } from '../lib/errors';

export interface UpdateProject extends ECreateProject {
  id: string;
}
export interface GetProject {
  id: string;
}

export const ProjectService = new class extends BaseService<
  Project,
  SynthiaProjectMetadata,
  UpdateProject,
  GetProject
> {
  async myProjects(userId: string) {
    const user = (await UserService.findById(userId))!;
    return await user.$get('projects');
  }

  async createProject(project: ECreateProject, userId: string) {
    try {
      return await Project.create({...project, creatorId: userId});
    } catch (e) {
      throw await handleSequelizeError(e);
    }
  }
}(Project)
