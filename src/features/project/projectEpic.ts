import { Epic, ofType } from "redux-observable";
import { catchError, switchMap, map } from 'rxjs/operators'
import { of } from "rxjs";
import { ActionTypes, actions } from "../../app/actions";
import { RootState } from "../../app/store";
import { fetchData } from "../../util/fetch";
import { IProject } from "./projectSlice";
import { commonActions } from "../common/commonSlice"

const fetchListEpic: Epic<ActionTypes, ActionTypes, RootState> = (action$, state$) => action$.pipe(
  ofType("/project/fetchList"),
  switchMap(() => {
    const { url } = state$.value.setting
    return fetchData<IProject[]>(url, "projects")
  }),
  map(data => actions.project.setList(data)),
  catchError(e => {
    console.log("err", e)
    return of(commonActions.epicDone())
  })
)
export const projectEpic = [
  fetchListEpic
]