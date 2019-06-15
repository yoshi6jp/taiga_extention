import React, { useContext, useMemo, useCallback } from "react";
import moment from "moment";
import _ from "lodash";
import ReactTooltip from "react-tooltip";
import CalendarHeatmap from "react-calendar-heatmap";
import { Alert } from "reactstrap";
import { RootContext } from "../Provider";
interface IItem {
  date: string;
  value: number;
  pureValue: number;
}
export const PomodoroHeatmap: React.FC = () => {
  const {
    state: { pomodoro_daily_totals }
  } = useContext(RootContext);
  const values = useMemo(
    () =>
      pomodoro_daily_totals.map(item => ({
        date: item.dateKey,
        value: item.value,
        pureValue: item.pureValue
      })),
    [pomodoro_daily_totals]
  );
  const maxVal = (_.maxBy(values, "value") || { value: 1 }).value;
  const classForValue = useCallback(
    (item: IItem) =>
      item
        ? `style-pomodoro color-pomodoro-${Math.ceil(
            ((item.value || 0) * 8) / maxVal
          )}`
        : "style-pomodoro empty-pomodoro",
    [maxVal]
  );
  const tooltipDataAttrs = useCallback(
    (item: IItem) =>
      item && item.date
        ? {
            "data-tip": `${item.value} Pomodoros on ${item.date}`
          }
        : null,
    []
  );
  const startDate = useMemo(
    () =>
      moment()
        .subtract(12, "month")
        .toDate(),
    []
  );
  if (pomodoro_daily_totals.length === 0) {
    return <Alert color="warning">No pomodoro history!</Alert>;
  } else {
    return (
      <>
        <CalendarHeatmap
          startDate={startDate}
          showWeekdayLabels={true}
          values={values}
          classForValue={classForValue}
          tooltipDataAttrs={tooltipDataAttrs}
        />
        <ReactTooltip />
      </>
    );
  }
};
