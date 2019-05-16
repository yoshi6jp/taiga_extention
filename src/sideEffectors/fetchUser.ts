import { IUser } from "../store";
import { ISideEffector, fetchData, ActionTypes, errToastr } from ".";
export const fetchUser: ISideEffector = async (action, dispatch, state) => {
  if (action.type === ActionTypes.FETCH_USER) {
    try {
      const { url } = state();
      const { uid } = action.payload;
      if (url && uid) {
        const { data: user } = await fetchData<IUser>(url, `users/${uid}`);
        dispatch({
          type: ActionTypes.SET_USER,
          payload: { user }
        });
      }
    } catch (e) {
      errToastr(e);
    }
  }
};
