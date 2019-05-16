import { ISideEffector, ActionTypes } from ".";
import axios from "axios";
export const setAuthToken: ISideEffector = (action, dispatch, state) => {
  if (action.type === ActionTypes.SET_AUTH_TOKEN) {
    const { auth_token } = action.payload;
    axios.defaults.headers.common["Authorization"] = `Bearer ${auth_token}`;
  }
};
