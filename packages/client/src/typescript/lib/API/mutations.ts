import createAudioClip from './mutations/createAudioClip.gql';
import createAudioTrack from './mutations/createAudioTrack.gql';
import createMidiClip from './mutations/createMidiClip.gql';
import createMidiTrack from './mutations/createMidiTrack.gql';
import createProject from './mutations/createProject.gql';
import createSynth from './mutations/createSynth.gql';
import updateAudioClip from './mutations/updateAudioClip.gql';
import updateAudioTrack from './mutations/updateAudioTrack.gql';
import updateMidiClip from './mutations/updateMidiClip.gql';
import updateMidiTrack from './mutations/updateMidiTrack.gql';
import updateProject from './mutations/updateProject.gql';
import updateSynth from './mutations/updateSynth.gql';

export const mutations = {
  createProject,
  updateProject,

  createMidiClip,
  updateMidiClip,
  createMidiTrack,
  updateMidiTrack,

  createAudioTrack,
  updateAudioTrack,
  createAudioClip,
  updateAudioClip,

  createSynth,
  updateSynth,
};
