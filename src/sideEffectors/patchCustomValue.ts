import { ISideEffector, patchData, ActionTypes, errToastr } from ".";
import { toastr } from "../util/toastr";
export const patchCustomValue: ISideEffector = async (
  action,
  dispatch,
  state
) => {
  if (action.type === ActionTypes.PATCH_CUSTOM_VALUE) {
    try {
      const {
        url,
        custom_value_map,
        tasks,
        in_progress_task_status_id
      } = state();
      const { id, key, value, version } = action.payload;
      const task = tasks.find(task => task.id === id);
      if (url && id && key && task && custom_value_map.has(task)) {
        const custom_value = custom_value_map.get(task);
        if (custom_value) {
          const { attributes_values } = custom_value;
          await patchData(url, `tasks/custom-attributes-values/${id}`, {
            attributes_values: {
              ...attributes_values,
              [key]: String(value)
            },
            version
          });
          if (
            value > 0 &&
            in_progress_task_status_id &&
            !task.is_closed &&
            task.status !== Number(in_progress_task_status_id)
          ) {
            dispatch({
              type: ActionTypes.PATCH_TASK,
              payload: {
                key: "status",
                value: in_progress_task_status_id,
                id: task.id
              }
            });
          }
          if (action.meta && action.meta.use_pomodoro) {
            const { used_number } = action.meta.use_pomodoro;
            dispatch({
              type: ActionTypes.USE_POMODORO,
              payload: { used_number }
            });
          }
          dispatch({ type: ActionTypes.UPDATE_DATA });
          toastr.success(`Custom value updated. [${value}]`);
        }
      }
    } catch (e) {
      errToastr(e);
    }
  }
};
