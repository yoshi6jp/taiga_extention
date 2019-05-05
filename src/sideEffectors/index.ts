import { Dispatch } from "react";
import { Actions, ActionTypes } from "../actions";
import { IState } from "../store";
import { baseUrl } from "../Provider";
import { fetchProjecs } from "./fetchProjects";
import { fetchMilestones } from "./fetchMilestones";
import { fetchTasks } from "./fetchTasks";
import { fetchTaskStatuses } from "./fetchTaskStatuses";
import { fetchCustomAttrs } from "./fetchCustomAttrs";
import { fetchCustomValueMap } from "./fetchCustomValueMap";
import axios, { AxiosRequestConfig } from "axios";
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
    default: {
    }
  }
};
