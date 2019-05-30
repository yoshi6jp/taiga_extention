import moment from "moment";
import _ from "lodash";
import { db } from "../AppDb";
import { ISideEffector, ActionTypes } from ".";
export const calcPomodoroTotal: ISideEffector = async (
  action,
  dispatch,
  state
) => {
  if (action.type === ActionTypes.CALC_POMODORO_TOTAL) {
    const query = action.payload;
    const totalDoc = await db.totals.get(query);
    const values = await db.items.where(query).toArray();
    const value = values.length;
    const pureValue = _.filter(values, { pure: true }).length;
    const dayOfWeek = moment(query.dateKey, "YYYY-MM-DD").day();
    const date = moment(query.dateKey, "YYYY-MM-DD").toDate();
    db.totals.put({ ...totalDoc, ...query, date, value, pureValue, dayOfWeek });
    dispatch({ type: ActionTypes.LOAD_POMODORO_TOTALS });
  }
};
