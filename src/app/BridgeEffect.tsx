import React, { useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { useSettingSelector } from "../features/setting/settingSlice";
import { RootContext } from "../Provider";
import { ActionTypes } from "../actions";
let dis: Dispatch<any>
export const getBridgeDispatch = () => dis
export const BridgeEffect: React.FC = () => {
  dis = useDispatch()
  const url = useSettingSelector.useUrl()
  const { dispatch } = useContext(RootContext)
  useEffect(() => {
    if (url && dispatch) {
      dispatch({ type: ActionTypes.SET_URL, payload: { url } })
    }
  }, [dispatch, url])
  return <></>
}