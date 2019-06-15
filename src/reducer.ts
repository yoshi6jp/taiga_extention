import _ from "lodash";
import { initialState, IProject, ICustomValueMap, IMilestone } from "./store";
import { ActionTypes, Actions } from "./actions";
export const reducer = (state = initialState, action: Actions) => {
  switch (action.type) {
    case ActionTypes.SET_URL: {
      const { url } = action.payload;
      return { ...state, url };
    }
    case ActionTypes.SET_PROJECTS: {
      const { projects } = action.payload;
      return {
        ...state,
        projects
      };
    }
    case ActionTypes.SET_PID: {
      const { pid } = action.payload;
      return {
        ...state,
        pid,
        project: {} as IProject,
        mid: "",
        biz_days: [],
        custom_attrs: [],
        milestones: [],
        custom_value_map: new WeakMap() as ICustomValueMap
      };
    }
    case ActionTypes.SET_PROJECT: {
      const { project } = action.payload;
      return {
        ...state,
        project
      };
    }
    case ActionTypes.SET_MID: {
      const { mid } = action.payload;
      return {
        ...state,
        mid,
        milestone: {} as IMilestone,
        tasks: []
      };
    }
    case ActionTypes.SET_MILESTONES: {
      const { milestones } = action.payload;
      return { ...state, milestones };
    }
    case ActionTypes.SET_MILESTONE: {
      const { milestone } = action.payload;
      return { ...state, milestone };
    }
    case ActionTypes.SET_CUSTOM_EID: {
      const { custom_eid } = action.payload;
      return { ...state, custom_eid };
    }
    case ActionTypes.SET_CUSTOM_ATTRS: {
      const { custom_attrs } = action.payload;
      return { ...state, custom_attrs };
    }
    case ActionTypes.SET_CUSTOM_ATTR_E: {
      const { custom_attr_e } = action.payload;
      return { ...state, custom_attr_e };
    }
    case ActionTypes.SET_CUSTOM_ATTR_R: {
      const { custom_attr_r } = action.payload;
      return { ...state, custom_attr_r };
    }
    case ActionTypes.SET_CUSTOM_RID: {
      const { custom_rid } = action.payload;
      return { ...state, custom_rid };
    }
    case ActionTypes.SET_BIZ_DAYS: {
      const { biz_days } = action.payload;
      return { ...state, biz_days };
    }
    case ActionTypes.ADD_BIZ_DAY: {
      const { biz_day } = action.payload;
      const biz_days = _.chain([...state.biz_days, biz_day])
        .uniq()
        .sort()
        .value();
      return { ...state, biz_days };
    }
    case ActionTypes.REMOVE_BIZ_DAY: {
      const { biz_day } = action.payload;
      const biz_days = _.reject([...state.biz_days], item => item === biz_day);
      return { ...state, biz_days };
    }
    case ActionTypes.SET_TASKS: {
      const { tasks } = action.payload;
      return { ...state, tasks };
    }
    case ActionTypes.SET_TASK_ID: {
      const { task_id } = action.payload;
      return { ...state, task_id, task: null };
    }
    case ActionTypes.RESET_TASK_ID: {
      return { ...state, task_id: "", task: null };
    }
    case ActionTypes.SET_TASK: {
      const { task } = action.payload;
      return { ...state, task };
    }
    case ActionTypes.SET_USER_TASKS: {
      const { user_tasks } = action.payload;
      return { ...state, user_tasks };
    }
    case ActionTypes.SET_TASK_STATUSES: {
      const { task_statuses } = action.payload;
      return { ...state, task_statuses };
    }
    case ActionTypes.SET_ACTIVE_TASK_STATUSES: {
      const { active_task_statuses } = action.payload;
      return { ...state, active_task_statuses };
    }
    case ActionTypes.SET_CUSTOM_VALUE_MAP: {
      const { custom_value_map } = action.payload;
      return { ...state, custom_value_map };
    }
    case ActionTypes.SET_USER: {
      const { user } = action.payload;
      return { ...state, user };
    }
    case ActionTypes.RESET_USER: {
      return { ...state, user: null, user_tasks: [] };
    }
    case ActionTypes.SET_REJECT_TASK_STATUS_IDS: {
      const { reject_task_status_ids } = action.payload;
      return { ...state, reject_task_status_ids };
    }
    case ActionTypes.ADD_REJECT_TASK_STATUS_ID: {
      const { reject_task_status_id } = action.payload;
      const reject_task_status_ids = _.chain([
        ...state.reject_task_status_ids,
        reject_task_status_id
      ])
        .compact()
        .uniq()
        .value();
      return { ...state, reject_task_status_ids };
    }
    case ActionTypes.REMOVE_REJECT_TASK_STATUS_ID: {
      const { reject_task_status_id } = action.payload;
      const reject_task_status_ids = _.reject(
        [...state.reject_task_status_ids],
        item => item === reject_task_status_id
      );
      return { ...state, reject_task_status_ids };
    }
    case ActionTypes.OPEN_CONTROLLER: {
      return { ...state, isOpen: true };
    }
    case ActionTypes.CLOSE_CONTROLLER: {
      return { ...state, isOpen: false };
    }
    case ActionTypes.UPDATE_DATA: {
      return { ...state, updated_time: Date.now() };
    }
    case ActionTypes.SIGN_IN: {
      const { username, password } = action.payload;
      return { ...state, username, password, auth_error: false };
    }
    case ActionTypes.SET_AUTH_TOKEN: {
      const { auth_token } = action.payload;
      return { ...state, auth_token };
    }
    case ActionTypes.SET_AUTH_ERROR: {
      return { ...state, auth_error: true };
    }
    case ActionTypes.SIGN_OUT: {
      return { ...state, auth_token: "", username: "", password: "" };
    }
    case ActionTypes.ADD_POMODORO: {
      const pomodoro_number = state.pomodoro_number + 1;
      return {
        ...state,
        pomodoro_number
      };
    }
    case ActionTypes.USE_POMODORO: {
      const { used_number } = action.payload;
      const pomodoro_used_number = Math.max(
        0,
        state.pomodoro_used_number + used_number
      );
      return {
        ...state,
        pomodoro_used_number
      };
    }
    case ActionTypes.RESET_POMODORO: {
      const { pomodoro_date } = action.payload;
      return {
        ...state,
        pomodoro_number: 0,
        pomodoro_used_number: 0,
        pomodoro_date
      };
    }
    case ActionTypes.RESTORE_POMODORO: {
      const {
        pomodoro_date,
        pomodoro_number,
        pomodoro_used_number
      } = action.payload;
      return {
        ...state,
        pomodoro_date,
        pomodoro_number,
        pomodoro_used_number
      };
    }
    case ActionTypes.SET_POMODORO_TOTALS: {
      const { pomodoro_daily_totals } = action.payload;
      return {
        ...state,
        pomodoro_daily_totals
      };
    }
    case ActionTypes.LOADED: {
      return {
        ...state,
        loaded: true
      };
    }
    case ActionTypes.SET_POMODORO_STATE: {
      const { pomodoro_state } = action.payload;
      return {
        ...state,
        pomodoro_state
      };
    }

    case ActionTypes.SET_POMODORO_MODE: {
      const { pomodoro_mode } = action.payload;
      return {
        ...state,
        pomodoro_mode
      };
    }
    case ActionTypes.SET_TIMELIMIT_CLOSE_TASK: {
      const { timelimit_close_task } = action.payload;
      return {
        ...state,
        timelimit_close_task
      };
    }
    case ActionTypes.SET_IN_PROGRESS_TASK_STATUS_ID: {
      const { task_status_id } = action.payload;
      return {
        ...state,
        in_progress_task_status_id: task_status_id
      };
    }
    default: {
      return state;
    }
  }
};
