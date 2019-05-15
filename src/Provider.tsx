import React, { createContext, useReducer, useEffect } from "react";
import _ from "lodash";
import { ActionTypes } from "./actions";
import { initialStateFn } from "./store";
import { reducer } from "./reducer";
import { Actions } from "./actions";
import { useSideEffector } from "./util/useSideEffector";
import { rootSideEffector } from "./sideEffectors";
import { init } from "./init";
export const baseUrl = (url: string) => `${url.replace(/[¥/]$/, "")}/api/v1`;

const initialState = initialStateFn();
export const RootContext = createContext({
  state: initialState,
  dispatch: (action: Actions) => {}
});
export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useSideEffector(
    useReducer(reducer, initialState),
    rootSideEffector
  );
  const value = {
    state,
    dispatch
  };

  useEffect(() => {
    if (state.url) {
      dispatch({ type: ActionTypes.FETCH_PROJECTS });
    }
  }, [dispatch, state.url]);
  useEffect(() => {
    if (state.url && state.pid) {
      dispatch({
        type: ActionTypes.FETCH_MILESTONES,
        payload: { project: state.pid }
      });
      dispatch({
        type: ActionTypes.FETCH_CUSTOM_ATTRS,
        payload: { project: state.pid }
      });
      dispatch({
        type: ActionTypes.FETCH_TASK_STATUSES,
        payload: { project: state.pid }
      });
      dispatch({
        type: ActionTypes.FETCH_PROJECT,
        payload: { pid: state.pid }
      });
    }
  }, [state.url, state.pid, dispatch]);
  useEffect(() => {
    if (state.url && state.mid) {
      dispatch({
        type: ActionTypes.FETCH_TASKS,
        payload: {
          milestone: state.mid,
          reject_task_status_ids: state.reject_task_status_ids
        }
      });
    }
  }, [
    state.url,
    state.mid,
    state.updated_time,
    state.reject_task_status_ids,
    dispatch
  ]);
  useEffect(() => {
    dispatch({
      type: ActionTypes.FETCH_CUSTOM_VALUE_MAP,
      payload: {
        tasks: state.tasks
      }
    });
  }, [dispatch, state.tasks, state.custom_eid, state.custom_rid]);
  useEffect(() => {
    const active_task_statuses = _.chain(state.task_statuses)
      .reject(item => _.includes(state.reject_task_status_ids, String(item.id)))
      .orderBy(item => item.order)
      .value();
    dispatch({
      type: ActionTypes.SET_ACTIVE_TASK_STATUSES,
      payload: { active_task_statuses }
    });
  }, [state.task_statuses, state.reject_task_status_ids, dispatch]);
  useEffect(() => {
    init(dispatch);
  }, [dispatch]);
  return <RootContext.Provider value={value}>{children}</RootContext.Provider>;
};
