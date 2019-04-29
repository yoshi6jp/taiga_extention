import { ActionTypes } from "../actions";
import { IMilestone } from "../store";
import { ISideEffector, fetchData } from ".";
export const fetchMilestones: ISideEffector = async (
  action,
  dispatch,
  state
) => {
  try {
    const { url } = state;
    const { project } = action.payload;
    if (url && project) {
      const { data: milestones } = await fetchData<IMilestone[]>(
        url,
        "milestones",
        { project }
      );
      dispatch({ type: ActionTypes.SET_MILESTONES, payload: { milestones } });
    }
  } catch (e) {
    console.log("err:fetchMilestones", e);
  }
};
