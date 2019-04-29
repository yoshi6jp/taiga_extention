import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { ICustomValueMap, IProject, IUser, ITask, ICustomAttr } from "./store";
import { RootContext, baseUrl } from "./Provider";
import classNames from "classnames";
import {
  Table,
  Button,
  Navbar,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Progress
} from "reactstrap";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSyncAlt,
  faMedal,
  faTimes,
  faEquals,
  faGrinBeam,
  faGrinBeamSweat,
  faDizzy
} from "@fortawesome/free-solid-svg-icons";
import styles from "./UserTasks.module.css";
import moment from "moment";
import { Link } from "react-router-dom";

const barStyles = ["success", "warning", "info", "danger"];
const getTasksByUser = (items: ITask[]) => _.groupBy(items, "assigned_to");
const getClosedTasks = (items: ITask[]) => items.filter(item => item.is_closed);
export const parseCustomVal = (val: string) =>
  _.chain(val)
    .replace(/[^0-9.+,]/g, "")
    .replace(/[+]/g, ",")
    .split(",")
    .compact()
    .map(Number)
    .sum()
    .value();

export const getCustomVal = (
  custom_value_map: ICustomValueMap,
  task: ITask,
  id: number
) => {
  if (custom_value_map.has(task)) {
    return parseCustomVal(
      _.get(custom_value_map.get(task), `attributes_values.${id}`, "0")
    );
  } else {
    return 0;
  }
};
const getGrade = (e: number, r: number): [string | null, number] => {
  if (_.isNumber(e) && _.isNumber(r) && e > 0) {
    const diff = Math.abs(e - r) / e;
    if (diff <= 0.05) {
      return ["gold", 3];
    }
    if (diff <= 0.1) {
      return ["silver", 2];
    }
    if (diff < 0.2) {
      return ["bronze", 1];
    }
  }
  return [null, 0];
};
const NameAndWorkLoad = ({
  username,
  val,
  total,
  imgSrc
}: {
  username: string;
  val: number;
  total: number;
  imgSrc: string;
}) => {
  if (!val) {
    return (
      <>
        <td>
          <img className={styles.avator} src={imgSrc} alt={username} />{" "}
          {username}
        </td>
        <td />
      </>
    );
  }
  const diff = (val - total) / total;
  let icon;
  let tblCls;
  if (diff < -0.1) {
    icon = faGrinBeam;
    tblCls = "";
  } else if (diff <= 0.1) {
    tblCls = "table-success";
    icon = faGrinBeam;
  } else if (diff <= 0.2) {
    tblCls = "table-warning";
    icon = faGrinBeamSweat;
  } else {
    tblCls = "table-danger";
    icon = faDizzy;
  }
  return (
    <>
      <td className={tblCls}>
        <img className={styles.avator} src={imgSrc} alt={username} /> {username}
        <FontAwesomeIcon className="mx-1" icon={icon} />
      </td>
      <td className={classNames(tblCls, "text-right")}>{val}</td>
    </>
  );
};

export const Medal = ({ e, r }: { e: number; r: number }) => {
  const [grade, num] = getGrade(e, r);
  if (grade) {
    return (
      <>
        {_.times(num).map(i => (
          <FontAwesomeIcon key={i} className={styles[grade]} icon={faMedal} />
        ))}
      </>
    );
  } else {
    return null;
  }
};
interface IProgressTotal {
  status: number;
  total: number;
  style?: string;
  label: string;
}
const UserRow = ({
  item,
  sums,
  isPast,
  total,
  hpd,
  closedTasks
}: {
  item: IUser;
  sums: { [key: string]: { e: number; r: number } };
  isPast: boolean;
  total: number;
  hpd: number;
  closedTasks: ITask[];
}) => {
  const {
    state: { custom_value_map, custom_eid, reject_task_status_ids, task_status }
  } = useContext(RootContext);
  const [customTotal, setTotal] = useState<number>(0);
  const [progressTotal, setProgressTotal] = useState<IProgressTotal[]>([]);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTotal(Number(e.target.value) || 0);
    },
    [setTotal]
  );
  const sumItem = _.get(sums, item.id);
  const e = _.get(sumItem, "e");
  const r = _.get(sumItem, "r");
  const margedTotal = customTotal || total;
  const totalStr = String(margedTotal);
  const imgSrc = item.photo || `http://i.pravatar.cc/80?u=${Math.random()}`;
  useEffect(() => {
    const closed_status = _.chain(task_status)
      .filter(item => item.is_closed)
      .reject(item => _.includes(reject_task_status_ids, String(item.id)))
      .orderBy("id")
      .reverse()
      .map(item => item.id)
      .value();
    const closedTotals = _.chain(closedTasks)
      .groupBy("status")
      .mapValues(ts =>
        _.reduce(
          ts,
          (result, t) => {
            result.status = t.status;
            result.total += getCustomVal(
              custom_value_map,
              t,
              Number(custom_eid)
            );
            result.label = t.status_extra_info.name;
            return result;
          },
          { status: 0, total: 0, label: "", style: "" }
        )
      )
      .value();
    const sortedTotals = _.orderBy(closedTotals, "status")
      .reverse()
      .map(item => ({
        ...item,
        style: barStyles[closed_status.indexOf(item.status)]
      }));
    setProgressTotal(sortedTotals);
  }, [
    setProgressTotal,
    custom_eid,
    custom_value_map,
    closedTasks,
    task_status,
    reject_task_status_ids
  ]);
  return (
    <tr key={item.id}>
      {total > 0 ? (
        <>
          <NameAndWorkLoad
            username={item.username}
            val={e}
            total={margedTotal}
            imgSrc={imgSrc}
          />
          <td className="text-right">{total}</td>
          <td className={styles.custom_input_td}>
            <Input
              bsSize="sm"
              type="number"
              className="text-right"
              value={totalStr}
              step={hpd}
              onChange={handleChange}
            />
          </td>
        </>
      ) : (
        <>
          <td>
            <img className={styles.avator} src={imgSrc} alt={item.username} />{" "}
            <Link to={`/${item.id}`}>{item.username}</Link>
          </td>
          <td className="text-right">{e}</td>
          <td className="text-right">{r}</td>
          <td>
            {_.isNumber(e) && (
              <Progress multi>
                {progressTotal.map((item, idx) => (
                  <Progress
                    bar
                    key={idx}
                    value={item.total}
                    color={item.style}
                    max={e}
                  >
                    {item.label}
                  </Progress>
                ))}
              </Progress>
            )}
          </td>
        </>
      )}

      {isPast ? (
        <td>
          <Medal e={e} r={r} />
        </td>
      ) : null}
    </tr>
  );
};
const getTaskSumByUser = (
  items: ITask[],
  custom_value_map: ICustomValueMap,
  custom_eid: string,
  custom_rid: string
) => {
  const eid = Number(custom_eid);
  const rid = Number(custom_rid);
  const tasksByUser = _.mapValues(getTasksByUser(items), tasks =>
    _.chain(tasks)
      .map(task => ({
        e: getCustomVal(custom_value_map, task, eid),
        r: getCustomVal(custom_value_map, task, rid)
      }))
      .reduce((result, val) => ({ e: result.e + val.e, r: result.r + val.r }), {
        e: 0,
        r: 0
      })
      .value()
  );
  return tasksByUser;
};
export const getCustomAttr = (items: ICustomAttr[], id: number) =>
  items.find(item => item.id === id);
export const UserTasks = () => {
  const {
    state: {
      url,
      pid,
      tasks,
      custom_value_map,
      custom_attrs,
      custom_eid,
      custom_rid,
      biz_days
    },
    updateData
  } = useContext(RootContext);
  const [items, setItems] = useState<IUser[]>([]);
  const [hpd, setHpd] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const activeLen = biz_days.length - 1;
  useEffect(() => {
    if (url && pid) {
      (async () => {
        const {
          data: { members }
        } = await axios.get<IProject>(`${baseUrl(url)}/projects/${pid}`);
        setItems(members);
      })();
    }
  }, [url, pid, setItems]);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setHpd(Number(e.target.value) || 0);
    },
    [setHpd]
  );
  const disableSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  useEffect(() => {
    setTotal(hpd * activeLen);
  }, [hpd, activeLen, setTotal]);
  const taskSumByUser = getTaskSumByUser(
    tasks,
    custom_value_map,
    custom_eid,
    custom_rid
  );
  const customAttrE = getCustomAttr(custom_attrs, Number(custom_eid));
  const customAttrR = getCustomAttr(custom_attrs, Number(custom_rid));
  if (!customAttrE || !customAttrR || biz_days.length <= 1) {
    return null;
  }
  const unassignedSum = _.get(taskSumByUser, "null.e", 0);
  const isPlanning = total > 0;
  const isPast =
    !isPlanning &&
    moment().diff(
      moment(_.last(biz_days))
        .local()
        .endOf("days")
    ) > 0;
  const tasksByUser = getTasksByUser(getClosedTasks(tasks));
  return (
    <>
      <Navbar color="light" light>
        <Form inline={true} className="mr-auto" onSubmit={disableSubmit}>
          <InputGroup>
            <Input
              type="number"
              step="0.5"
              placeholder="hours / day"
              className="text-right"
              onChange={handleChange}
            />
            <InputGroupAddon addonType="append">
              <InputGroupText>
                <FontAwesomeIcon className="mx-2" icon={faTimes} />
                {activeLen} [days]
                <FontAwesomeIcon className="mx-2" icon={faEquals} />
              </InputGroupText>
              {total > 0 ? (
                <>
                  <InputGroupText className="bg-white">
                    <strong>{total}</strong>
                  </InputGroupText>
                  <InputGroupText>hours / sprint</InputGroupText>
                </>
              ) : null}
            </InputGroupAddon>
          </InputGroup>
        </Form>
        <Button onClick={updateData}>
          <FontAwesomeIcon icon={faSyncAlt} />
        </Button>
      </Navbar>
      <Table bordered>
        <thead>
          <tr>
            <th>Name</th>
            <th>{customAttrE.name}</th>
            {isPlanning ? (
              <>
                <th>Total</th> <th>Custom</th>
              </>
            ) : (
              <>
                <th>{customAttrR.name}</th>
                <th>Progress</th>
              </>
            )}
            {isPast ? <th>Grade</th> : null}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <UserRow
              key={item.id}
              isPast={isPast}
              item={item}
              sums={taskSumByUser}
              total={total}
              hpd={hpd}
              closedTasks={tasksByUser[item.id] || []}
            />
          ))}
          <tr key="null">
            <td>unassigned</td>
            <td className="text-right text-danger">{unassignedSum}</td>
            <td />
            <td />
            {isPast ? <td /> : null}
          </tr>
        </tbody>
      </Table>
    </>
  );
};
