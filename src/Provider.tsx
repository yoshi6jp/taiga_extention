import React, { createContext, useReducer, useEffect } from "react";
import _ from "lodash";
import moment from "moment";
import { ActionTypes } from "./actions";
import { initialState, ICustomAttr, IMilestone, ITask } from "./store";
import { reducer } from "./reducer";
import { Actions } from "./actions";
import { useSideEffector } from "./util/useSideEffector";
import { rootSideEffector } from "./sideEffectors";
import { init } from "./init";
import { messaging, Timers } from "./util/firebase";
import { TimerMode } from "./util/timer";
export const baseUrl = (url: string) => `${url.replace(/[¥/]$/, "")}/api/v1`;
const getCustomAttr = (items: ICustomAttr[], id: number) =>
  _.find(items, { id });
const getMilestone = (items: IMilestone[], mid: string) =>
  items.find(item => String(item.id) === mid);
const getUserTasks = (items: ITask[], uid: number) =>
  _.chain(items)
    .filter({ assigned_to: uid })
    .sortBy("user_story")
    .value();

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
    if (
      state.url &&
      state.mid &&
      state.milestone.id &&
      state.timelimit_close_task
    ) {
      dispatch({
        type: ActionTypes.FETCH_TASKS,
        payload: {
          milestone: state.mid,
          reject_task_status_ids: state.reject_task_status_ids,
          timelimit_close_task: state.timelimit_close_task
        }
      });
    }
  }, [
    state.url,
    state.mid,
    state.updated_time,
    state.reject_task_status_ids,
    dispatch,
    state.milestone.id,
    state.timelimit_close_task
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
    const custom_attr_e = getCustomAttr(
      state.custom_attrs,
      Number(state.custom_eid)
    );
    if (custom_attr_e) {
      dispatch({
        type: ActionTypes.SET_CUSTOM_ATTR_E,
        payload: { custom_attr_e }
      });
    }
  }, [dispatch, state.custom_attrs, state.custom_eid]);
  useEffect(() => {
    const custom_attr_r = getCustomAttr(
      state.custom_attrs,
      Number(state.custom_rid)
    );
    if (custom_attr_r) {
      dispatch({
        type: ActionTypes.SET_CUSTOM_ATTR_R,
        payload: { custom_attr_r }
      });
    }
  }, [dispatch, state.custom_attrs, state.custom_rid]);
  useEffect(() => {
    const milestone = getMilestone(state.milestones, state.mid);
    if (milestone) {
      dispatch({
        type: ActionTypes.SET_MILESTONE,
        payload: { milestone }
      });
    }
  }, [dispatch, state.mid, state.milestones]);
  useEffect(() => {
    if (state.tasks.length > 0 && state.user) {
      const user_tasks = getUserTasks(state.tasks, state.user.id);
      dispatch({ type: ActionTypes.SET_USER_TASKS, payload: { user_tasks } });
    }
  }, [dispatch, state.tasks, state.user]);

  useEffect(() => {
    init(dispatch);
  }, [dispatch]);
  useEffect(() => {
    if (state.task_id) {
      const task = state.tasks.find(item => item.id === Number(state.task_id));
      if (task) {
        dispatch({ type: ActionTypes.SET_TASK, payload: { task } });
      }
    }
  }, [dispatch, state.task_id, state.tasks]);
  useEffect(() => {
    const firstDay = state.biz_days[0];
    if (firstDay && !state.timelimit_close_task) {
      const timelimit_close_task = `${moment(firstDay)
        .local()
        .startOf("day")
        .format("YYYY-MM-DD")}T12:00`;
      dispatch({
        type: ActionTypes.SET_TIMELIMIT_CLOSE_TASK,
        payload: { timelimit_close_task }
      });
    }
  }, [dispatch, state.biz_days, state.milestone, state.timelimit_close_task]);
  useEffect(() => {
    if (state.task_statuses.length > 0) {
      const task_status = state.task_statuses.find(
        item => item.slug === "in-progress"
      );
      task_status &&
        dispatch({
          type: ActionTypes.SET_IN_PROGRESS_TASK_STATUS_ID,
          payload: { task_status_id: String(task_status.id) }
        });
    }
  }, [dispatch, state.task_statuses, state.task_statuses.length]);
  useEffect(() => {
    messaging.onTokenRefresh(async () => {
      const token = await messaging.getToken();
      dispatch({
        type: ActionTypes.SET_TOKEN,
        payload: { token }
      });
    });
    messaging.getToken().then(token => {
      dispatch({
        type: ActionTypes.SET_TOKEN,
        payload: { token }
      });
    });
  }, [dispatch]);
  useEffect(() => {
    Object.values(TimerMode).forEach(mode => {
      Timers.where("mode", "==", mode).onSnapshot(docs => {
        dispatch({
          type: ActionTypes.SET_POMODORO_LIVE_COUNT,
          payload: { mode, value: docs.size }
        });
      });
    });
  }, [dispatch]);
  return <RootContext.Provider value={value}>{children}</RootContext.Provider>;
};
