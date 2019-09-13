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
import { EMidiClip, EUpdateMidiClip, ECreateMidiClip } from '@synthia/api/dist/gql/entities/MidiClipEntity';

import { API_URL } from '../../config';
import { mutations } from './mutations';
import { queries } from './queries';
import { EMidiTrack, ECreateMidiTrack, EUpdateMidiTrack } from '@synthia/api/dist/gql/entities/MidiTrackEntity';



export const API = new class {
  private _url = `${API_URL}/graphql`;
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
  async createMidiClip(mc: ECreateMidiClip) {
    return this._request<EMidiClip>('mutation', 'createMidiClip', { midiClip: mc })
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

  /**
   * Wraps the API
   * @param type Mutation or Query
   * @param name Name of mutation/query
   * @param variables Query name
   */
  private async _request<Return>(
    type: 'mutation' | 'query',
    name: (keyof typeof queries) | (keyof typeof mutations),
    variables?: any,
    headers?: object
  ): Promise<Return> {
    // Lookup the query
    // @ts-ignore
    const query = (type === 'mutation' ? this._mutations : this._queries)[name];


    const result = await fetch(this._url, {
      headers: {
        ...this._headers,
        ...headers
      },
      method: 'post',
      // @ts-ignore
      body: JSON.stringify({ query, variables })
    }).then(r => r.json());

    // Return if successful with no errors and includes data
    if (!result.errors && result.data) return result.data[name];

    // Throw error matching GraphQL request error format
    const errName = result && result.errors[0] ? result.errors[0].message : 'Unknown error';
    const e = new Error(errName);

    // @ts-ignore
    e.response = result;
    throw e;
  }
}
