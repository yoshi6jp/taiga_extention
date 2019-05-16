import { ITask } from "../store";
import { ISideEffector, fetchData, ActionTypes, errToastr } from ".";
import _ from "lodash";
export const fetchTasks: ISideEffector = async (action, dispatch, state) => {
  if (action.type === ActionTypes.FETCH_TASKS) {
    try {
      const { url, reject_task_status_ids } = state();
      const { milestone } = action.payload;
      if (url && milestone) {
        const { data } = await fetchData<ITask[]>(url, "tasks", {
          headers: { "x-disable-pagination": true },
          params: { milestone }
        });
        const tasks = data.filter(
          item => !_.includes(reject_task_status_ids, String(item.status))
        );
        dispatch({ type: ActionTypes.SET_TASKS, payload: { tasks } });
      }
    } catch (e) {
      errToastr(e);
    }
  }
};
