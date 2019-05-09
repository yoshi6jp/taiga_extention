import { IMilestone } from "../store";
import { ISideEffector, fetchData, ActionTypes } from ".";
export const fetchMilestones: ISideEffector = async (
  action,
  dispatch,
  state
) => {
  if (action.type === ActionTypes.FETCH_MILESTONES) {
    try {
      const { url } = state();
      const { project } = action.payload;
      if (url && project) {
        const { data: milestones } = await fetchData<IMilestone[]>(
          url,
          "milestones",
          { params: { project } }
        );
        dispatch({ type: ActionTypes.SET_MILESTONES, payload: { milestones } });
      }
    } catch (e) {
      console.log("err:fetchMilestones", e);
    }
  }
};
