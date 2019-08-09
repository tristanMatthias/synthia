import { OAuthResolver } from './OAuthResolver';
import { ProjectResolver } from './ProjectResolver';
import { SynthResolver } from './SynthResolver';
import { UserResolver } from './UserResolver';


export const resolvers = [
  UserResolver,
  OAuthResolver,
  ProjectResolver,
  SynthResolver,
];
