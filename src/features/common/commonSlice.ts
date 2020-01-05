import { createAction, createReducer } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
interface State {
  updatedTime: number;
}
const initialState: State = {
  updatedTime: 0
}
export const commonActions = {
  epicDone: createAction<void, "/common/epicDone">("/common/epicDone"),
  updateData: createAction<void, "/common/updateData">("/common/updateData")
}
export const commonReducer = createReducer(initialState, builder => builder
  .addCase(commonActions.updateData, (state) => ({
    ...state, updatedTime: Date.now()
  }))
)
const commonSelectors = {
  updatedTimeSelector: (state: RootState) => state.common.updatedTime
}
export const useCommonSelector = {
  useUpdatedTime: () => useSelector(commonSelectors.updatedTimeSelector)
}
export type CommonActionTypes = ReturnType<typeof commonActions.epicDone>
  | ReturnType<typeof commonActions.updateData>
