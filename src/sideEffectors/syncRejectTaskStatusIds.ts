import { StorageKey, setToStorageWithSubkey } from "../store";
import { ISideEffector } from ".";
import _ from "lodash";
export const syncRejectTaskStatusIds: ISideEffector = (
  action,
  dispatch,
  state
) => {
  _.defer(() => {
    const { pid, reject_task_status_ids } = state();
    setToStorageWithSubkey(
      StorageKey.REJECT_TASK_STATUS_IDS,
      pid,
      reject_task_status_ids.join(",")
    );
  });
};
