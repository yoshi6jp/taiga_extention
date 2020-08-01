import { combineReducers } from "@reduxjs/toolkit";
import { settingReducer } from "../features/setting/settingSlice";
import { projectReducer } from "../features/project/projectSlice";
import { userStoryReducer } from "../features/userStory/userStorySlice";
import { milestoneReducer } from "../features/milestone/milestoneSlice";
import { commonReducer } from "../features/common/commonSlice";
import { alarmReducer } from "../features/alarm/alarmSlice";

export const rootReducer = combineReducers({
  setting: settingReducer,
  project: projectReducer,
  userStory: userStoryReducer,
  milestone: milestoneReducer,
  common: commonReducer,
  alarm: alarmReducer,
});
