import { EUser } from "@synthia/api/dist/gql/entities/UserEntity";
import { wrapProxy } from "../lib/Model/wrapProxy";

export interface AppState {
  user: {
    checked: boolean;
    loading: boolean;
    token: string | null;
    data: EUser | null
  }
}

const initialState: AppState = {
  user: {
    checked: false,
    loading: false,
    token: localStorage.getItem('token'),
    data: null
  }
}

export const state = wrapProxy(initialState);
// @ts-ignore
window.state = state;
