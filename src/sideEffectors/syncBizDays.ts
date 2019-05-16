import { StorageKey, setToStorageWithSubkey } from "../store";
import { ISideEffector } from ".";
export const syncBizDays: ISideEffector = (action, dispathc, state) => {
  const { mid, biz_days } = state();
  setToStorageWithSubkey(StorageKey.BIZ_DAYS, mid, biz_days.join(","));
};
