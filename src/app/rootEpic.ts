import { combineEpics } from "redux-observable";
import { projectEpic } from "../features/project/projectEpic";
export const rootEpic = combineEpics(...projectEpic)
