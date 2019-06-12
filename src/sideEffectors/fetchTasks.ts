import { ITask } from "../store";
import { ISideEffector, fetchData, ActionTypes, errToastr } from ".";
import _ from "lodash";
import moment from "moment";
export const fetchTasks: ISideEffector = async (action, dispatch, state) => {
  if (action.type === ActionTypes.FETCH_TASKS) {
    try {
      const {
        url,
        reject_task_status_ids,
        milestone: { estimated_start }
      } = state();
      const { milestone } = action.payload;
      const startM = moment(estimated_start)
        .local()
        .startOf("day");
      if (url && milestone) {
        const { data } = await fetchData<ITask[]>(url, "tasks", {
          headers: { "x-disable-pagination": true },
          params: { milestone }
        });
        const tasks = data
          .filter(
            item => !_.includes(reject_task_status_ids, String(item.status))
          )
          .filter(item => moment(item.finished_date).diff(startM) > 0);

        dispatch({ type: ActionTypes.SET_TASKS, payload: { tasks } });
      }
    } catch (e) {
      errToastr(e);
    }
  }
};
