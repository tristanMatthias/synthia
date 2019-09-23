import { AudioClipResolver } from './AudioClipResolver';
import { AudioTrackResolver } from './AudioTrackResolver';
import { MidiClipResolver } from './MidiClipResolver';
import { MidiTrackResolver } from './MidiTrackResolver';
import { OAuthResolver } from './OAuthResolver';
import { ProjectResolver } from './ProjectResolver';
import { SynthResolver } from './SynthResolver';
import { UserResolver } from './UserResolver';


export const resolvers = [
  AudioClipResolver,
  AudioTrackResolver,
  MidiClipResolver,
  MidiTrackResolver,
  OAuthResolver,
  ProjectResolver,
  SynthResolver,
  UserResolver
];
