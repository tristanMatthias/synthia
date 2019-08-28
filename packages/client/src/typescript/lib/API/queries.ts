import me from './queries/me.gql';
import mostRecentProject from './queries/mostRecentProject.gql';
import oauthCallback from './queries/oauthCallback.gql';
import project from './queries/project.gql';
import projects from './queries/projects.gql';

export const queries = {
  oauthCallback,
  me,
  mostRecentProject,
  project,
  projects
}
