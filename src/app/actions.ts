import { ProjectActionTypes, projectActions as project } from "../features/project/projectSlice";
import { SettingActionTypes, settingActions as setting } from '../features/setting/settingSlice'
import { CommonActionTypes, commonActions as common } from "../features/common/commonSlice"
export type ActionTypes = ProjectActionTypes | SettingActionTypes | CommonActionTypes
export const actions = {
  common,
  project,
  setting
}
