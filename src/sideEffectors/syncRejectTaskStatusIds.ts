import { StorageKey, setToStorageWithSubkey } from "../store";
import { ISideEffector } from ".";
export const syncRejectTaskStatusIds: ISideEffector = (
  action,
  dispatch,
  state
) => {
  const { pid, reject_task_status_ids } = state();
  setToStorageWithSubkey(
    StorageKey.REJECT_TASK_STATUS_IDS,
    pid,
    reject_task_status_ids.join(",")
  );
};
