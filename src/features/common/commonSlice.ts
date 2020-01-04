import { createAction } from "@reduxjs/toolkit";
export const commonActions = {
  epicDone: createAction<void, "/common/epicDone">("/common/epicDone")
}
export type CommonActionTypes = ReturnType<typeof commonActions.epicDone>
