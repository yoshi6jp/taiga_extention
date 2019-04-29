import { ActionTypes } from "../actions";
import { ITask } from "../store";
import { ISideEffector, fetchData } from ".";
export const fetchTasks: ISideEffector = async (action, dispatch, state) => {
  try {
    const { url } = state;
    const { milestone } = action.payload;
    if (url && milestone) {
      const { data } = await fetchData<ITask[]>(url, "tasks");
    }
  } catch (e) {
    console.log("err:fetchTasks", e);
  }
};
