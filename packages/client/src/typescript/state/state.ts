import { EUser } from "@synthia/api/dist/gql/entities/UserEntity";
import { proxa } from "proxa";

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

export const state = proxa(initialState);
// @ts-ignore
window.state = state;
