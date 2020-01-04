import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import { rootReducer } from "./rootReducer";
import { rootEpic } from "./rootEpic";
import { ActionTypes } from "./actions"

export type RootState = ReturnType<typeof rootReducer>
const epicMiddleware = createEpicMiddleware<ActionTypes, ActionTypes, RootState>()
export const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware(), epicMiddleware]
})
epicMiddleware.run(rootEpic)
export type AppDispatch = typeof store.dispatch