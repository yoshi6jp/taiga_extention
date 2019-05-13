import { IAuthToken, StorageKey, setToStorage } from "../store";
import { ISideEffector, postData, ActionTypes, errToastr } from ".";
import { toastr } from "../util/toastr";
export const signIn: ISideEffector = async (action, dispatch, state) => {
  if (action.type === ActionTypes.SIGN_IN) {
    try {
      const { url } = state();
      const { username, password } = action.payload;
      if (url && username && password) {
        const {
          data: { auth_token }
        } = await postData<IAuthToken>(url, "auth", {
          username,
          password,
          type: "normal"
        });
        dispatch({ type: ActionTypes.SET_AUTH_TOKEN, payload: { auth_token } });
        setToStorage(StorageKey.USERNAME, username);
        setToStorage(StorageKey.PASSWORD, password);
        toastr.success(`${username} signed in.`);
      }
    } catch (e) {
      dispatch({ type: ActionTypes.SET_AUTH_ERROR });
      dispatch({ type: ActionTypes.SIGN_OUT });
      errToastr(e);
    }
  }
};
