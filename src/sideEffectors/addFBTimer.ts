import { addTimer } from "../util/firebase";
import { ISideEffector, ActionTypes } from ".";
export const addFBTimer: ISideEffector = async (action, dispatch, state) => {
  if (action.type === ActionTypes.ADD_FB_TIMER) {
    const { token, pomodoro_mode } = state();
    const { title, body, remaining } = action.payload;
    if (token) {
      const timer_id = await addTimer(
        title,
        body,
        remaining,
        token,
        pomodoro_mode
      );
      dispatch({ type: ActionTypes.SET_TIMER_ID, payload: { timer_id } });
    }
  }
};
