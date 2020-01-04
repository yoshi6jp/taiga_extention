import { combineReducers } from "@reduxjs/toolkit";
import { settingReducer } from "../features/setting/settingSlice";
import { projectReducer } from "../features/project/projectSlice"

export const rootReducer = combineReducers({
  setting: settingReducer,
  project: projectReducer
});
