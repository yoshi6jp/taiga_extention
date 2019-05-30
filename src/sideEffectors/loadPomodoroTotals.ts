import { db } from "../AppDb";
import { ISideEffector, ActionTypes } from ".";
export const loadPomodoroTotals: ISideEffector = async (
  action,
  dispatch,
  state
) => {
  const pomodoro_daily_totals = await db.totals.toArray();
  dispatch({
    type: ActionTypes.SET_POMODORO_TOTALS,
    payload: { pomodoro_daily_totals }
  });
};
