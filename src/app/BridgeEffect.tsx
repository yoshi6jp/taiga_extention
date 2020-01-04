import React, { useEffect, useContext } from "react";
import { useSettingSelector } from "../features/setting/settingSlice";
import { RootContext } from "../Provider";
import { ActionTypes } from "../actions";
export const BridgeEffect: React.FC = () => {
  const url = useSettingSelector.useUrl()
  const { dispatch } = useContext(RootContext)
  useEffect(() => {
    if (url && dispatch) {
      dispatch({ type: ActionTypes.SET_URL, payload: { url } })
    }
  }, [dispatch, url])
  return <></>
}