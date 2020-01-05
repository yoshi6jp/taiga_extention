import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSettingSelector } from '../features/setting/settingSlice'
import { projectActions } from "../features/project/projectSlice";
import { useMilestoneSelector } from "../features/milestone/milestoneSlice";
import { userStoryActions } from "../features/userStory/userStorySlice";
import { useCommonSelector } from "../features/common/commonSlice"
export const SideEffect: React.FC = () => {
  const dispatch = useDispatch()
  const url = useSettingSelector.useUrl()
  const mid = useMilestoneSelector.useMid()
  const updatedTime = useCommonSelector.useUpdatedTime()
  useEffect(() => {
    url && dispatch(projectActions.fetchList())
  }, [url, dispatch])
  useEffect(() => {
    url && mid && dispatch(userStoryActions.fetchList({ milestone: Number(mid) }))
  }, [url, mid, dispatch, updatedTime])
  return <></>
}

