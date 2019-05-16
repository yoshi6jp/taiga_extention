import { Dispatch } from "react";
import { Actions, ActionTypes } from "../actions";
import { IState } from "../store";
import { baseUrl } from "../Provider";
import { fetchProjecs } from "./fetchProjects";
import { fetchProject } from "./fetchProject";
import { fetchMilestones } from "./fetchMilestones";
import { fetchTasks } from "./fetchTasks";
import { fetchTaskStatuses } from "./fetchTaskStatuses";
import { fetchCustomAttrs } from "./fetchCustomAttrs";
import { fetchCustomValueMap } from "./fetchCustomValueMap";
import { fetchUser } from "./fetchUser";
import { patchCustomValue } from "./patchCustomValue";
import { patchTask } from "./patchTask";
import { signIn } from "./signIn";
import { signOut } from "./signOut";
import { setAuthToken } from "./setAuthToken";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { toastr } from "../util/toastr";
export { ActionTypes };
export type ISideEffector = (
  action: Actions,
  dispatch: Dispatch<Actions>,
  state: () => IState
) => void;
export const fetchData = <T>(
  url: string,
  path: string,
  config?: AxiosRequestConfig
) => axios.get<T>(`${baseUrl(url)}/${path}`, config);
export const postData = <T>(
  url: string,
  path: string,
  data: object,
  config?: AxiosRequestConfig
) => axios.post<T>(`${baseUrl(url)}/${path}`, data, config);
export const patchData = (
  url: string,
  path: string,
  data: object,
  config?: AxiosRequestConfig
) => axios.patch(`${baseUrl(url)}/${path}`, data, config);
export const errToastr = (err: AxiosError) => {
  let message: string;
  try {
    message = err.response ? err.response.data._error_message : "error";
  } catch (e) {
    message = e.message || e;
  }
  toastr.error(message);
};
export const rootSideEffector = (
  action: Actions,
  dispatch: Dispatch<Actions>,
  state: () => IState
) => {
  switch (action.type) {
    case ActionTypes.FETCH_PROJECTS: {
      fetchProjecs(action, dispatch, state);
      return;
    }
    case ActionTypes.FETCH_PROJECT: {
      fetchProject(action, dispatch, state);
      return;
    }
    case ActionTypes.FETCH_MILESTONES: {
      fetchMilestones(action, dispatch, state);
      return;
    }
    case ActionTypes.FETCH_TASKS: {
      fetchTasks(action, dispatch, state);
      return;
    }
    case ActionTypes.FETCH_TASK_STATUSES: {
      fetchTaskStatuses(action, dispatch, state);
      return;
    }
    case ActionTypes.FETCH_CUSTOM_ATTRS: {
      fetchCustomAttrs(action, dispatch, state);
      return;
    }
    case ActionTypes.FETCH_CUSTOM_VALUE_MAP: {
      fetchCustomValueMap(action, dispatch, state);
      return;
    }
    case ActionTypes.FETCH_USER: {
      fetchUser(action, dispatch, state);
      return;
    }
    case ActionTypes.PATCH_CUSTOM_VALUE: {
      patchCustomValue(action, dispatch, state);
      return;
    }
    case ActionTypes.SIGN_IN: {
      signIn(action, dispatch, state);
      return;
    }
    case ActionTypes.PATCH_TASK: {
      patchTask(action, dispatch, state);
      return;
    }
    case ActionTypes.SIGN_OUT: {
      signOut(action, dispatch, state);
      return;
    }
    case ActionTypes.SET_AUTH_TOKEN: {
      setAuthToken(action, dispatch, state);
      return;
    }
    default: {
    }
  }
};
