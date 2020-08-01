import { createReducer, createAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
interface State {
  emitAt: number;
  type: string;
}
const initState: State = {
  emitAt: 0,
  type: "",
};

export const alarmActions = {
  play: createAction<{ type: string }, "/alarm/play">("/alarm/play"),
};

export const alarmReducer = createReducer(initState, (builder) =>
  builder.addCase(alarmActions.play, (state, { payload: { type } }) => ({
    ...state,
    emitAt: Date.now(),
    type: type,
  }))
);

const selectors = {
  useEvt: (state: RootState) => state.alarm,
};
export const useAlarm = {
  useEvt: () => useSelector(selectors.useEvt),
};
