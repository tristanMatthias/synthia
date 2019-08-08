import { API_URL } from "../../config";

import {queries} from './queries';
import {mutations} from './mutations';

export const API = new class {
  private _url = `${API_URL}/graphql`;
  private _mutations = mutations;
  private _queries = queries;
  private _token: string | null = localStorage.getItem('token');

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
  async request<Return>(
    type: 'mutation' | 'query',
    name: (keyof typeof queries) | (keyof typeof mutations),
    variables?: object,
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
