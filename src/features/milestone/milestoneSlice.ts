import { createReducer, createAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
interface State {
  mid: string;
}
const initialState: State = {
  mid: ""
}
export const milestoneActions = {
  setMid: createAction<string | number, "/milestone/setMid">("/milestone/setMid")
}
export const milestoneReducer = createReducer(initialState, builder => builder
  .addCase(milestoneActions.setMid, (state, { payload: mid }) => ({
    ...state, mid: String(mid)
  }))
)
const milestoneSelectors = {
  midSelector: (state: RootState) => state.milestone.mid
}
export const useMilestoneSelector = {
  useMid: () => useSelector(milestoneSelectors.midSelector)
}
