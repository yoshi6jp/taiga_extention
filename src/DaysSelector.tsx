import React, { useEffect, useState, useContext, useCallback } from 'react';
import classNames from 'classnames';
import {
  UncontrolledTooltip,
  Table,
  Card,
  CardHeader,
  Input,
  Label,
  FormGroup,
  Badge
} from 'reactstrap';
import { IMilestone } from './store';
import { RootContext } from './Provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import moment, { Moment } from 'moment';
import biz from 'moment-business';
import _ from 'lodash';
const getMilestone = (mid: string, items: IMilestone[]) =>
  items.find(item => String(item.id) === mid);
const getDays = (item: IMilestone) => {
  const startM = moment(item.estimated_start).local();
  const finishM = moment(item.estimated_finish).local();
  const daysInSprint = finishM.diff(startM, 'days');
  return _.times(daysInSprint).map(i => startM.clone().add(i, 'days'));
};
const getDefaultBizDays = (items: Moment[]) =>
  items
    .filter(item => biz.isWeekDay(item))
    .map(item => item.format('YYYY-MM-DD'));

const weekClassName = (day: number) => ({
  'text-danger': day === 0,
  'text-info': day === 6
});

const DayItem = ({
  item,
  biz_days,
  idx
}: {
  item: Moment | null;
  biz_days: string[];
  idx: number;
}) => {
  if (!item) {
    return (
      <td>
        <br />
      </td>
    );
  }
  const { addBizDay, removeBizDay } = useContext(RootContext);
  const value = item.format('YYYY-MM-DD');
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const bizDay = e.target.value;
      e.target.checked ? addBizDay(bizDay) : removeBizDay(bizDay);
    },
    [addBizDay, removeBizDay]
  );
  const isPlanning = value === biz_days[0];
  const eleId = `biz-day-${value}`;
  return (
    <>
      <td
        className={classNames(weekClassName(idx), { 'table-info': isPlanning })}
        id={eleId}
      >
        {biz.isWeekDay(item) ? (
          <FormGroup check inline>
            <Label check>
              <Input
                onChange={handleChange}
                disabled={biz.isWeekendDay(item)}
                value={value}
                type="checkbox"
                defaultChecked={_.includes(biz_days, value)}
                className="form-check-input"
              />
              {value}
            </Label>
          </FormGroup>
        ) : (
          <span>{value}</span>
        )}
      </td>
      {isPlanning ? (
        <UncontrolledTooltip target={eleId}>
          <FontAwesomeIcon className="mr-1" icon={faClipboardList} />
          Planning
        </UncontrolledTooltip>
      ) : null}
    </>
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
    return null;
  } else {
    const weekdays = _.chunk(
      [..._.times(items[0].day(), () => null), ...items],
      7
    );
    return (
      <Card>
        <CardHeader>Business Days</CardHeader>
        <Table bordered>
          <thead>
            <tr>
              {moment.weekdays().map((item, idx) => (
                <th className={classNames('text-center', weekClassName(idx))}>
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weekdays.map(days => (
              <tr>
                {days.map((item, idx) => (
                  <DayItem
                    idx={idx}
                    key={idx}
                    item={item}
                    biz_days={biz_days}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    );
  }
};
