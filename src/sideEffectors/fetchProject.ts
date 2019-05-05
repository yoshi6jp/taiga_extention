import { ActionTypes } from "../actions";
import { IProject } from "../store";
import { ISideEffector, fetchData } from ".";
export const fetchProject: ISideEffector = async (action, dispatch, state) => {
  if (action.type === ActionTypes.FETCH_PROJECT) {
    try {
      const { url } = state();
      const { pid } = action.payload;
      if (url && pid) {
        const { data: project } = await fetchData<IProject>(
          url,
          `projects/${pid}`
        );
        dispatch({
          type: ActionTypes.SET_PROJECT,
          payload: { project }
        });
      }
    } catch (e) {
      console.log("err:fetchProject", e);
    }
  }
};
