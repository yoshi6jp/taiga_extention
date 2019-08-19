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
import { setUrl } from "./setUrl";
import { setPid } from "./setPid";
import { setMid } from "./setMid";
import { setCustomEid } from "./setCustomEid";
import { setCustomRid } from "./setCustomRid";
import { syncBizDays } from "./syncBizDays";
import { syncRejectTaskStatusIds } from "./syncRejectTaskStatusIds";
import { syncPomodoro } from "./syncPomodoro";
import { addPomodoro } from "./addPomodoro";
import { calcPomodoroTotal } from "./calcPomodoroTotal";
import { loadPomodoroTotals } from "./loadPomodoroTotals";
import { syncTaskId } from "./syncTaskId";
import { setTimelineCloseTask } from "./setTimelineCloseTask";
import { addFBTimer } from "./addFBTimer";
import { delFBTimer } from "./dellFBTimer";
import { setTimerId } from "./setTimerId";
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
    case ActionTypes.SET_URL: {
      setUrl(action, dispatch, state);
      return;
    }
    case ActionTypes.SET_PID: {
      setPid(action, dispatch, state);
      break;
    }
    case ActionTypes.SET_MID: {
      setMid(action, dispatch, state);
      break;
    }
    case ActionTypes.SET_CUSTOM_EID: {
      setCustomEid(action, dispatch, state);
      break;
    }
    case ActionTypes.SET_CUSTOM_RID: {
      setCustomRid(action, dispatch, state);
      break;
    }
    case ActionTypes.SET_BIZ_DAYS:
    case ActionTypes.ADD_BIZ_DAY:
    case ActionTypes.REMOVE_BIZ_DAY: {
      syncBizDays(action, dispatch, state);
      break;
    }
    case ActionTypes.ADD_REJECT_TASK_STATUS_ID:
    case ActionTypes.REMOVE_REJECT_TASK_STATUS_ID: {
      syncRejectTaskStatusIds(action, dispatch, state);
      break;
    }
    case ActionTypes.ADD_POMODORO: {
      addPomodoro(action, dispatch, state);
      syncPomodoro(action, dispatch, state);
      break;
    }
    case ActionTypes.USE_POMODORO:
    case ActionTypes.RESET_POMODORO: {
      syncPomodoro(action, dispatch, state);
      break;
    }
    case ActionTypes.CALC_POMODORO_TOTAL: {
      calcPomodoroTotal(action, dispatch, state);
      break;
    }
    case ActionTypes.LOAD_POMODORO_TOTALS: {
      loadPomodoroTotals(action, dispatch, state);
      break;
    }
    case ActionTypes.SET_TASK_ID:
    case ActionTypes.RESET_TASK_ID: {
      syncTaskId(action, dispatch, state);
      break;
    }
    case ActionTypes.SET_TIMELIMIT_CLOSE_TASK: {
      setTimelineCloseTask(action, dispatch, state);
      break;
    }
    case ActionTypes.ADD_FB_TIMER: {
      addFBTimer(action, dispatch, state);
      break;
    }
    case ActionTypes.DEL_FB_TIMER: {
      delFBTimer(action, dispatch, state);
      break;
    }
    case ActionTypes.SET_TIMER_ID: {
      setTimerId(action, dispatch, state);
      break;
    }
    default: {
    }
  }
};
