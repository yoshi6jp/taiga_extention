import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Input, Label } from 'reactstrap';
import { IMilestore } from './store';
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

const DayItem = ({ item, biz_days }: { item: Moment; biz_days: string[] }) => {
  const { addBizDay, removeBizDay } = useContext(RootContext);
  const value = item.format('YYYY-MM-DD');
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const bizDay = e.target.value;
      e.target.checked ? addBizDay(bizDay) : removeBizDay(bizDay);
    },
    [addBizDay, removeBizDay]
  );
  return (
    <div className="form-check form-check-inline">
      <Input
        onChange={handleChange}
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
  const [items, setItems] = useState<Moment[]>([]);
  useEffect(
    () => {
      const milestone = getMilestone(mid, milestones);
      if (milestone) {
        const items = getDays(milestone);
        setItems(items);
        if (biz_days.length <= 1) {
          setBizDays(getDefaultBizDays(items));
        }
      }
    },
    [mid, milestones, biz_days]
  );
  if (items.length === 0) {
    return (
      <div className="text-center">
        <div className="spinner-grow text-center" />
      </div>
    );
  } else {
    return (
      <>
        {items.map(item => (
          <DayItem key={item.toString()} item={item} biz_days={biz_days} />
        ))}
      </>
    );
  }
};
