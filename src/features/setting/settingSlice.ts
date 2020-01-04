import {
  createAction,
  createReducer,
} from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from '../../app/store'
interface State {
  url: string;
  pid: string;
  mid: string;
  custom_eid: string;
  custom_rid: string;
}
const initialState: State = {
  url: "",
  pid: "",
  mid: "",
  custom_eid: "",
  custom_rid: ""
}
export const settingActions = {
  setUrl: createAction<string, "/setting/setUrl">("/setting/setUrl")
}
export const settingReducer = createReducer(initialState, builder => builder
  .addCase(settingActions.setUrl, (state, { payload: url }) => ({
    ...state, url
  })))
export type SettingActionTypes = ReturnType<typeof settingActions.setUrl>
export const settingSelectors = {
  urlSelector: (state: RootState) => state.setting.url
}

export const useSettingSelector = {
  useUrl: () => useSelector(settingSelectors.urlSelector)
}
