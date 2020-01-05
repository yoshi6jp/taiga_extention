import { createReducer, createAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
export interface IUserStoryExtraInfo {
  id: number;
  subject: string;
  epics: any;
  ref: number;
}
type ITag = [string, string | null]
export interface IUserStory {
  id: number;
  subject: string;
  tags: ITag[];
}
interface State {
  list: IUserStory[];
  loading: boolean;
}
const initialState: State = {
  list: [],
  loading: false
}
export const userStoryActions = {
  fetchList: createAction<{ milestone: number }, "/userStory/fetchList">("/userStory/fetchList"),
  setList: createAction<IUserStory[], "/userStory/setList">("/userStory/setList"),
  addTag: createAction<{ milestone: number, tag: string }, "/userStory/addTag">("/userStory/addTag"),
  removeTag: createAction<{ milestone: number, tag: string }, "/userStory/removeTag">("/userStory/removeTag"),
}
export const userStoryReducer = createReducer(initialState, builder => builder
  .addCase(userStoryActions.fetchList, (state) => ({
    ...state, loading: true
  }))
  .addCase(userStoryActions.setList, (state, { payload: list }) => ({
    ...state, loading: false, list
  }))
)
export type UserStoryActionTypes = ReturnType<typeof userStoryActions.fetchList> | ReturnType<typeof userStoryActions.setList> | ReturnType<typeof userStoryActions.addTag> | ReturnType<typeof userStoryActions.removeTag>
const userStorySelectors = {
  listSelector: (state: RootState) => state.userStory.list
}
export const useUserStorySelector = {
  useList: () => useSelector(userStorySelectors.listSelector)
}


