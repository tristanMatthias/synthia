import {
  ECreateProject,
  ECreateSynth,
  EOauthCallbackInput,
  EProject,
  ESynth,
  ETokenResult,
  EUpdateProject,
  EUpdateSynth,
  EUser,
} from '@synthia/api';
import { EAudioClip, ECreateAudioClip, EUpdateAudioClip } from '@synthia/api/dist/gql/entities/AudioClipEntity';
import { EAudioTrack, ECreateAudioTrack, EUpdateAudioTrack } from '@synthia/api/dist/gql/entities/AudioTrackEntity';
import { ECreateMidiClip, EMidiClip, EUpdateMidiClip } from '@synthia/api/dist/gql/entities/MidiClipEntity';
import { ECreateMidiTrack, EMidiTrack, EUpdateMidiTrack } from '@synthia/api/dist/gql/entities/MidiTrackEntity';

import { client } from './apollo';
import { mutations } from './mutations';
import { queries } from './queries';

const omit = require('omit-deep-lodash');



export const API = new class {
  // private _url = `${API_URL}/graphql`;
  private _mutations = mutations;
  private _queries = queries;
  private _token: string | null = localStorage.getItem('token');


  // --------------------------------------------------------------------- OAuth
  async oauthCallback(details: EOauthCallbackInput) {
    return this._request<ETokenResult>('query', 'oauthCallback', { details })
  }

  // --------------------------------------------------------------------- OAuth
  async me() {
    return this._request<EUser>('query', 'me')
  }

  // ------------------------------------------------------------------ Projects
  async mostRecentProject() {
    return this._request<EProject>('query', 'mostRecentProject')
  }
  async listProjects() {
    return this._request<EProject[]>('query', 'projects')
  }
  async loadProject(projectId: string) {
    return this._request<EProject>('query', 'project', { projectId })
  }
  async createProject(project: ECreateProject) {
    return this._request<EProject>('mutation', 'createProject', { project })
  }
  async updateProject(project: EUpdateProject) {
    return this._request<EProject>('mutation', 'updateProject', { project })
  }
  async createSynth(synth: ECreateSynth) {
    return this._request<ESynth>('mutation', 'createSynth', { synth })
  }
  async updateSynth(synth: EUpdateSynth) {
    return this._request<ESynth>('mutation', 'updateSynth', { synth })
  }


  // ---------------------------------------------------------------- Midi clips
  async createMidiClip(midiClip: ECreateMidiClip) {
    return this._request<EMidiClip>('mutation', 'createMidiClip', { midiClip })
  }
  async updateMidiClip(midiClip: EUpdateMidiClip) {
    return this._request<EMidiClip>('mutation', 'updateMidiClip', { midiClip })
  }

  // --------------------------------------------------------------- Midi tracks
  async createMidiTrack(midiTrack: ECreateMidiTrack) {
    return this._request<EMidiTrack>('mutation', 'createMidiTrack', { midiTrack })
  }
  async updateMidiTrack(midiTrack: EUpdateMidiTrack) {
    return this._request<EMidiTrack>('mutation', 'updateMidiTrack', { midiTrack })
  }

  // ---------------------------------------------------------------- Audio clips
  async createAudioClip(audioClip: ECreateAudioClip) {
    return this._request<EAudioClip>('mutation', 'createAudioClip', { audioClip })
  }
  async updateAudioClip(audioClip: EUpdateAudioClip) {
    return this._request<EAudioClip>('mutation', 'updateAudioClip', { audioClip })
  }

  // -------------------------------------------------------------- Audio tracks
  async createAudioTrack(audioTrack: ECreateAudioTrack) {
    return this._request<EAudioTrack>('mutation', 'createAudioTrack', { audioTrack })
  }
  async updateAudioTrack(audioTrack: EUpdateAudioTrack) {
    return this._request<EAudioTrack>('mutation', 'updateAudioTrack', { audioTrack })
  }


  // ----------------------------------------------------------- Private methods
  private get _headers() {
    const headers: HeadersInit = {
      'content-type': 'application/json'
    };
    if (this._token) headers.authorization = `Bearer ${this._token}`;
    return headers;
  }

  authenticate(token: string) {
    localStorage.setItem('token', token);
    this._token = token;
  }



  private async _request<Return extends object = {}>(
    type: 'mutation' | 'query',
    name: (keyof typeof queries) | (keyof typeof mutations),
    variables?: any
  ) {
    const vars = omit(variables, '__typename');
    let res;
    if (type === 'mutation') {

      res = await client.mutate({
        mutation: this._mutations[name as keyof typeof mutations],
        variables: vars,
        context: {
          headers: this._headers
        }
      })
    } else {
      res = await client.query({
        query: this._queries[name as keyof typeof queries],
        variables: vars,
        context: {
          headers: this._headers
        }
      });
    }

    return res.data[name] as Return;
  }
}
