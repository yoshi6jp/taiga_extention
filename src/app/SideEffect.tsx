import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSettingSelector } from '../features/setting/settingSlice'
import { projectActions } from "../features/project/projectSlice";
export const SideEffect: React.FC = () => {
  const dispatch = useDispatch()
  const url = useSettingSelector.useUrl()
  useEffect(() => {
    url && dispatch(projectActions.fetchList())
  }, [url, dispatch])
  return <></>
}

