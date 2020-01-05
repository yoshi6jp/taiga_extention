import { ProjectActionTypes, projectActions as project } from "../features/project/projectSlice";
import { SettingActionTypes, settingActions as setting } from '../features/setting/settingSlice'
import { CommonActionTypes, commonActions as common } from "../features/common/commonSlice"
import { UserStoryActionTypes, userStoryActions as userStory } from "../features/userStory/userStorySlice";
export type ActionTypes = ProjectActionTypes | SettingActionTypes | CommonActionTypes | UserStoryActionTypes
export const actions = {
  common,
  project,
  setting,
  userStory
}
