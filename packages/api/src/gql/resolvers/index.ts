import { MidiClipResolver } from './MidiClipResolver';
import { MidiTrackResolver } from './MidiTrackResolver';
import { OAuthResolver } from './OAuthResolver';
import { ProjectResolver } from './ProjectResolver';
import { SynthResolver } from './SynthResolver';
import { UserResolver } from './UserResolver';


export const resolvers = [
  MidiClipResolver,
  MidiTrackResolver,
  OAuthResolver,
  ProjectResolver,
  SynthResolver,
  UserResolver
];
