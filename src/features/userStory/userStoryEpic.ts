import { Epic, ofType } from "redux-observable";
import { catchError, switchMap, map } from "rxjs/operators";
import { of } from "rxjs";
import { ActionTypes, actions } from "../../app/actions";
import { RootState } from "../../app/store";
import { fetchData } from "../../util/fetch";
import { IUserStory } from "./userStorySlice";
import { commonActions } from "../common/commonSlice"

const fetchListEpic: Epic<ActionTypes, ActionTypes, RootState> = (action$, state$) => action$.pipe(
  ofType("/userStory/fetchList"),
  switchMap((action) => {
    const { url } = state$.value.setting
    if (action.type === "/userStory/fetchList") {
      const { milestone } = action.payload
      return fetchData<IUserStory[]>(url, `userstories?milestone=${milestone}`)
    } else {
      return []
    }
  }),
  map(data => actions.userStory.setList(data)),
  catchError(e => {
    console.log("err", e)
    return of(commonActions.epicDone())
  })
)
export const userStoryEpic = [
  fetchListEpic
]