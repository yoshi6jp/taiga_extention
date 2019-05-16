import { IProject } from "../store";
import { ISideEffector, fetchData, ActionTypes, errToastr } from ".";
export const fetchProjecs: ISideEffector = async (action, dispatch, state) => {
  try {
    const { url } = state();
    if (url) {
      const { data: projects } = await fetchData<IProject[]>(url, "projects");
      dispatch({ type: ActionTypes.SET_PROJECTS, payload: { projects } });
    }
  } catch (e) {
    errToastr(e);
  }
};
