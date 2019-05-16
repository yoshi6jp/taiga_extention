import { StorageKey } from "../store";
import { ISideEffector } from ".";
import axios from "axios";
export const signOut: ISideEffector = (action, dispatch, state) => {
  localStorage.removeItem(StorageKey.USERNAME);
  localStorage.removeItem(StorageKey.PASSWORD);
  if (axios.defaults.headers.common["Authorization"]) {
    delete axios.defaults.headers.common["Authorization"];
  }
};
