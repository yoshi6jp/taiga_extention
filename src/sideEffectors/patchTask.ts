import { ActionTypes, ISideEffector, patchData } from ".";
export const patchTask: ISideEffector = async (action, dispatch, state) => {
  if (action.type === ActionTypes.PATCH_TASK) {
    try {
      const { url, tasks } = state();
      const { id, key, value } = action.payload;
      const task = tasks.find(task => task.id === id);
      if (url && id && key && task) {
        await patchData(url, `tasks/${id}`, {
          [key]: value,
          version: task.version
        });
        dispatch({ type: ActionTypes.UPDATE_DATA });
      }
    } catch (e) {
      console.log("err:patchTask", e);
    }
  }
};
