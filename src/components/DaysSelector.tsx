import React, { useEffect, useState, useContext, useCallback } from "react";
import classNames from "classnames";
import {
  UncontrolledTooltip,
  Table,
  Card,
  CardHeader,
  Input,
  Label,
  FormGroup
} from "reactstrap";
import { IMilestone } from "../store";
import { RootContext } from "../Provider";
import moment, { Moment } from "moment";
import biz from "moment-business";
import _ from "lodash";
import { ActionTypes } from "../actions";
export const isToday = (date: string) =>
  moment()
    .local()
    .format("YYYY-MM-DD") ===
  moment(date)
    .local()
    .format("YYYY-MM-DD");

export const dayNameFromIdx = (date: string, idx: number) => {
  if (idx === -1) {
    return "";
  }
  if (idx === 0) {
    return "Planning";
  }
  return `Day ${idx}`;
};

export const dayName = (date: string, biz_days: string[]) => {
  const idx = biz_days.indexOf(date);
  return dayNameFromIdx(date, idx);
};
const getDays = (item: IMilestone) => {
  const startM = moment(item.estimated_start).local();
  const finishM = moment(item.estimated_finish).local();
  const daysInSprint = finishM.diff(startM, "days");
  return _.times(daysInSprint).map(i => startM.clone().add(i, "days"));
};
const getDefaultBizDays = (items: Moment[]) =>
  items
    .filter(item => biz.isWeekDay(item))
    .map(item => item.format("YYYY-MM-DD"));

const weekClassName = (day: number) => ({
  "text-danger": day === 0,
  "text-info": day === 6
});

interface DayItemProps {
  item: Moment | null;
  idx: number;
}
const DayItem: React.FC<DayItemProps> = ({ item, idx }) => {
  const {
    state: { biz_days },
    dispatch
  } = useContext(RootContext);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const biz_day = e.target.value;
      if (e.target.checked) {
        dispatch({ type: ActionTypes.ADD_BIZ_DAY, payload: { biz_day } });
      } else {
        dispatch({ type: ActionTypes.REMOVE_BIZ_DAY, payload: { biz_day } });
      }
    },
    [dispatch]
  );
  if (!item) {
    return (
      <td>
        <br />
      </td>
    );
  }
  const value = item.format("YYYY-MM-DD");
  const isPlanning = value === biz_days[0];
  const eleId = `biz-day-${value}`;
  const checked = _.includes(biz_days, value);
  return (
    <>
      <td
        className={classNames(weekClassName(idx), { "table-info": isPlanning })}
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
                checked={checked}
                className="form-check-input"
              />
              {value}
            </Label>
          </FormGroup>
        ) : (
          <span>{value}</span>
        )}
      </td>
      {checked ? (
        <UncontrolledTooltip target={eleId}>
          {dayName(value, biz_days)}
        </UncontrolledTooltip>
      ) : null}
    </>
  );
};

export const DaysSelector: React.FC = () => {
  const {
    state: { biz_days, milestone },
    dispatch
  } = useContext(RootContext);
  const [items, setItems] = useState<Moment[]>([]);
  useEffect(() => {
    if (milestone) {
      const items = getDays(milestone);
      setItems(items);
      if (biz_days.length <= 1) {
        dispatch({
          type: ActionTypes.SET_BIZ_DAYS,
          payload: { biz_days: getDefaultBizDays(items) }
        });
      }
    }
  }, [milestone, biz_days, dispatch]);
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
                <th
                  key={idx}
                  className={classNames("text-center", weekClassName(idx))}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weekdays.map((days, i) => (
              <tr key={i}>
                {days.map((item, idx) => (
                  <DayItem idx={idx} key={idx} item={item} />
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    );
  }
};
