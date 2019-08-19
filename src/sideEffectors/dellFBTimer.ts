import { delTimer } from "../util/firebase";
import { ISideEffector, ActionTypes } from ".";
export const delFBTimer: ISideEffector = (action, dispatch, state) => {
  if (action.type === ActionTypes.DEL_FB_TIMER) {
    const { timer_id } = state();
    if (timer_id) {
      delTimer(timer_id);
      dispatch({ type: ActionTypes.SET_TIMER_ID, payload: { timer_id: null } });
    }
  }
};
