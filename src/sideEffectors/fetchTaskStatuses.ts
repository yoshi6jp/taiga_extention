import { ITaskStatus } from "../store";
import { ISideEffector, fetchData, ActionTypes } from ".";
export const fetchTaskStatuses: ISideEffector = async (
  action,
  dispatch,
  state
) => {
  if (action.type === ActionTypes.FETCH_TASK_STATUSES) {
    try {
      const { url } = state();
      const { project } = action.payload;
      if (url && project) {
        const { data: task_statuses } = await fetchData<ITaskStatus[]>(
          url,
          "task-statuses",
          { params: { project } }
        );
        dispatch({
          type: ActionTypes.SET_TASK_STATUSES,
          payload: { task_statuses }
        });
      }
    } catch (e) {
      console.log("err:fetchTaskStatuses", e);
    }
  }
};
