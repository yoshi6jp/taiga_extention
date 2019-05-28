import { StorageKey, setToStorage } from "../store";
import { ISideEffector } from ".";
import _ from "lodash";
export const syncPomodoro: ISideEffector = (action, dispatchm, state) => {
  _.defer(() => {
    const { pomodoro_date, pomodoro_number, pomodoro_used_number } = state();
    setToStorage(StorageKey.POMODORO_DATE, pomodoro_date);
    setToStorage(StorageKey.POMODORO_NUMBER, String(pomodoro_number));
    setToStorage(StorageKey.POMODORO_USED_NUMBER, String(pomodoro_used_number));
  });
};
