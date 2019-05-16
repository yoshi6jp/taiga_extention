import { ICustomAttr } from "../store";
import { ISideEffector, fetchData, ActionTypes, errToastr } from ".";
export const fetchCustomAttrs: ISideEffector = async (
  action,
  dispatch,
  state
) => {
  if (action.type === ActionTypes.FETCH_CUSTOM_ATTRS) {
    try {
      const { url } = state();
      const { project } = action.payload;
      if (url && project) {
        const { data: custom_attrs } = await fetchData<ICustomAttr[]>(
          url,
          "task-custom-attributes",
          { params: { project } }
        );
        dispatch({
          type: ActionTypes.SET_CUSTOM_ATTRS,
          payload: { custom_attrs }
        });
      }
    } catch (e) {
      errToastr(e);
    }
  }
};
