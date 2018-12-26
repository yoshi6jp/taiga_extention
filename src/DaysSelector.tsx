import React, { useEffect, useState, useContext } from 'react';
import { Input, Label } from 'reactstrap';
import { IMilestore } from './MilestoneSelector';
import { RootContext } from './Provider';
import moment, { Moment } from 'moment';
import biz from 'moment-business';
import _ from 'lodash';
const getMilestone = (mid: string, items: IMilestore[]) =>
  items.find(item => String(item.id) === mid);
const getDays = (item: IMilestore) => {
  const startM = moment(item.estimated_start);
  const finishM = moment(item.estimated_finish);
  const daysInSprint = finishM.diff(startM, 'days');
  return _.times(daysInSprint).map(i => startM.clone().add(i, 'days'));
};
const getDefaultBizDays = (items: Moment[]) =>
  items
    .filter(item => biz.isWeekDay(item))
    .map(item => item.format('YYYY-MM-DD'));
const getBizDays = (biz_days: string[], items: Moment[]) => {
  if (biz_days.length === 0) {
    return getDefaultBizDays(items);
  } else {
    biz_days;
  }
};
const DayItem = ({ item, biz_days }: { item: Moment; biz_days: string[] }) => {
  const value = item.format('YYYY-MM-DD');
  return (
    <div className="form-check form-check-inline">
      <Input
        disabled={biz.isWeekendDay(item)}
        id={value}
        value={value}
        type="checkbox"
        defaultChecked={_.includes(biz_days, value)}
        className="form-check-input"
      />
      <Label className="form-check-label" for={value}>
        {value}
      </Label>
    </div>
  );
};
export const DaysSelector = () => {
  const {
    state: { mid, milestones, biz_days },
    setBizDays
  } = useContext(RootContext);
  const milestone = getMilestone(mid, milestones);
  if (milestone) {
    const days = getDays(milestone);
    if (
      biz_days.length === 0 ||
      moment(milestone.estimated_start).diff(moment(_.first(biz_days))) > 0 ||
      moment(milestone.estimated_finish).diff(moment(_.last(biz_days))) < 0
    ) {
      setBizDays(getDefaultBizDays(days));
    }
    return (
      <>
        {days.map(item => (
          <DayItem key={item.toString()} item={item} biz_days={biz_days} />
        ))}
      </>
    );
  } else {
    return <h1>loading...</h1>;
  }
};
