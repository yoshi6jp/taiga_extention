import { ActionTypes } from "../actions";
import { ISideEffector, patchData } from ".";
export const patchCustomValue: ISideEffector = async (
  action,
  dispatch,
  state
) => {
  if (action.type === ActionTypes.PATCH_CUSTOM_VALUE) {
    try {
      const { url, custom_value_map, tasks } = state();
      const { id, key, value, version } = action.payload;
      const task = tasks.find(task => task.id === id);
      if (url && id && key && value && task && custom_value_map.has(task)) {
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
          dispatch({ type: ActionTypes.UPDATE_DATA });
        }
      }
    } catch (e) {
      console.log("err:patchCustomValue", e);
    }
  }
};
