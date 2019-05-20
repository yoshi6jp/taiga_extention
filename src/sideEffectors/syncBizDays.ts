import { StorageKey, setToStorageWithSubkey } from "../store";
import { ISideEffector } from ".";
import _ from "lodash";
export const syncBizDays: ISideEffector = (action, dispathc, state) => {
  _.defer(() => {
    const { mid, biz_days } = state();
    setToStorageWithSubkey(StorageKey.BIZ_DAYS, mid, biz_days.join(","));
  });
};
