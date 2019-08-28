import createProject from './mutations/createProject.gql';
import createSynth from './mutations/createSynth.gql';
import updateSynth from './mutations/updateSynth.gql';
import updateProject from './mutations/updateProject.gql';
import createMidiClip from './mutations/createMidiClip.gql';
import updateMidiClip from './mutations/updateMidiClip.gql';
import createMidiTrack from './mutations/createMidiTrack.gql';
import updateMidiTrack from './mutations/updateMidiTrack.gql';

export const mutations = {
  createProject,
  createMidiClip,
  updateMidiClip,
  createMidiTrack,
  updateMidiTrack,
  createSynth,
  updateSynth,
  updateProject
};
