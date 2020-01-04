import { IProjectExtraInfo } from "../project/projectSlice";
import { IUserStoryExtraInfo } from "../userStory/userStorySlice";
interface IStatusExtraInfo {
  name: string;
  is_closed: boolean;
}
export interface ICustomValue {
  attributes_values: {
    [key: number]: string;
  };
  version: number;
}
export type ICustomValueMap = WeakMap<ITask, ICustomValue>;
export interface ITask {
  id: number;
  assigned_to: number | null;
  created_date: string;
  finished_date: string;
  is_closed: boolean;
  subject: string;
  ref: number;
  project: number;
  project_extra_info: IProjectExtraInfo;
  status: number;
  status_extra_info: IStatusExtraInfo;
  user_story: number;
  user_story_extra_info: IUserStoryExtraInfo;
  version: number;
}