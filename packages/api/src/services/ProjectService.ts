import { EMetadata } from '../gql/entities/MetadataEntity';
import { ECreateProject } from '../gql/entities/ProjectEntity';
import { handleSequelizeError } from '../lib/errors';
import { Project } from '../models/Project';
import { BaseService } from './BaseService';
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
