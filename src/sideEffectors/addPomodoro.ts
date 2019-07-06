import moment from "moment";
import _ from "lodash";
import { db } from "../AppDb";
import { ISideEffector, ActionTypes, fetchData } from ".";
import { ICustomValue } from "../store";
export const addPomodoro: ISideEffector = async (action, dispatch, state) => {
  if (action.type === ActionTypes.ADD_POMODORO && action.meta) {
    const { url, task_id, custom_rid } = state();
    const { completedAt, duration, pure } = action.meta;
    const dateKey = moment(completedAt).format("YYYY-MM-DD");
    await db.items.put({ completedAt, duration, pure, dateKey });
    dispatch({ type: ActionTypes.CALC_POMODORO_TOTAL, payload: { dateKey } });
    if (task_id && custom_rid) {
      const { data: custom_attr_val } = await fetchData<ICustomValue>(
        url,
        `tasks/custom-attributes-values/${task_id}`
      );
      const value =
        Number(_.get(custom_attr_val, `attributes_values.${custom_rid}`, "0")) +
        0.5;
      const { version } = custom_attr_val;
      if (custom_attr_val && version) {
        dispatch({
          type: ActionTypes.PATCH_CUSTOM_VALUE,
          payload: {
            id: Number(task_id),
            key: custom_rid,
            value,
            version
          },
          meta: { use_pomodoro: { used_number: 1 }, update_status: true }
        });
      }
    }
  }
};
