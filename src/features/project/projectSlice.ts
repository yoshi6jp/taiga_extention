import {
  createReducer,
  createAction
} from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store"
import { IUser } from "../user/userSlice";
export interface IProject {
  id: number;
  name: string;
  members: IUser[];
}
export interface IProjectExtraInfo {
  id: number;
  name: string;
  slug: string;
}
interface State {
  list: IProject[];
  loading: boolean;
  current: IProject | null;
}
const initialState: State = {
  list: [],
  loading: false,
  current: null
}
export const projectActions = {
  fetchList: createAction<void, "/project/fetchList">("/project/fetchList"),
  setList: createAction<IProject[], "/project/setList">("/project/setList")
}
export const projectReducer = createReducer(initialState, builder => builder
  .addCase(projectActions.fetchList, (state) => ({
    ...state, loading: true
  }))
  .addCase(projectActions.setList, (state, { payload: list }) => ({
    ...state, list, loading: false
  }))
)

export type ProjectActionTypes = ReturnType<typeof projectActions.fetchList> | ReturnType<typeof projectActions.setList>
export const projectSelectors = {
  listSelector: (state: RootState) => state.project.list
}

export const useProjectSelector = {
  useList: () => useSelector(projectSelectors.listSelector)
}