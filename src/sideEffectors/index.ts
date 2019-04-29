import { Dispatch } from "react";
import { Actions, ActionTypes } from "../actions";
import { IState } from "../store";
import { baseUrl } from "../Provider";
import { fetchProjecs } from "./fetchProjects";
import { fetchMilestones } from "./fetchMilestones";
import axios from "axios";
export type ISideEffector = (
  action: Actions,
  dispatch: Dispatch<Actions>,
  state: IState
) => void;
export const fetchData = <T>(
  url: string,
  path: string,
  params?: object,
  headers?: object
  // ) => axios.get<T>(`${baseUrl(url)}/${path}`, params ? { params } : undefined);
) =>
  axios.get<T>(
    `${baseUrl(url)}/${path}`,
    !params && !headers ? undefined : { params, headers }
  );
export const rootSideEffector = (
  action: Actions,
  dispatch: Dispatch<Actions>,
  state: IState
) => {
  console.log("side effect", action);
  switch (action.type) {
    case ActionTypes.FETCH_PROJECTS: {
      fetchProjecs(action, dispatch, state);
      return;
    }
    case ActionTypes.FETCH_MILESTONES: {
      fetchMilestones(action, dispatch, state);
      return;
    }
  }
};
