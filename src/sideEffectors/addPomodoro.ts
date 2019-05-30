import moment from "moment";
import { db } from "../AppDb";
import { ISideEffector, ActionTypes } from ".";
export const addPomodoro: ISideEffector = async (action, dispatch, state) => {
  if (action.type === ActionTypes.ADD_POMODORO && action.meta) {
    const { completedAt, duration, pure } = action.meta;
    const dateKey = moment(completedAt).format("YYYY-MM-DD");
    await db.items.put({ completedAt, duration, pure, dateKey });
    dispatch({ type: ActionTypes.CALC_POMODORO_TOTAL, payload: { dateKey } });
  }
};
