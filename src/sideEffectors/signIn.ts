import { ActionTypes } from "../actions";
import { IAuthToken } from "../store";
import { ISideEffector, postData } from ".";
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
      }
    } catch (e) {
      dispatch({ type: ActionTypes.SET_AUTH_ERROR });
      console.log("err:signIn", e);
    }
  }
};
