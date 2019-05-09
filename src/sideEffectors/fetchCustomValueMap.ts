import { ITask, ICustomValue } from "../store";
import { ISideEffector, fetchData, ActionTypes } from ".";
export const fetchCustomValueMap: ISideEffector = async (
  action,
  dispatch,
  state
) => {
  if (action.type === ActionTypes.FETCH_CUSTOM_VALUE_MAP) {
    try {
      const { url, custom_eid, custom_rid } = state();
      const { tasks } = action.payload;
      if (url && tasks.length && custom_eid && custom_rid) {
        const custom_value_map = new WeakMap(
          await Promise.all(
            tasks.map(async item => {
              const { data: custom_attr_val } = await fetchData<ICustomValue>(
                url,
                `tasks/custom-attributes-values/${item.id}`
              );
              return [item, custom_attr_val] as [ITask, ICustomValue];
            })
          )
        );
        dispatch({
          type: ActionTypes.SET_CUSTOM_VALUE_MAP,
          payload: { custom_value_map }
        });
      }
    } catch (e) {
      console.log("err:fetchCustomValueMap", e);
    }
  }
};
