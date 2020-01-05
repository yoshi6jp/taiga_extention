import { combineEpics } from "redux-observable";
import { projectEpic } from "../features/project/projectEpic";
import { userStoryEpic } from "../features/userStory/userStoryEpic";
export const rootEpic = combineEpics(...projectEpic, ...userStoryEpic)
