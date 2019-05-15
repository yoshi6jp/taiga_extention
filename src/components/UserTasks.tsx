import React, { useCallback, useContext, useEffect, useState } from "react";
import { Avatar, AvatarProps } from "@rmwc/avatar";
import { ICustomValueMap, IUser, ITask, ICustomAttr } from "../store";
import { RootContext } from "../Provider";
import classNames from "classnames";
import {
  Table,
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
  faMedal,
  faTimes,
  faEquals,
  faGrinBeam,
  faGrinBeamSweat,
  faDizzy,
  faGhost
} from "@fortawesome/free-solid-svg-icons";
import { UpdateButton } from "./UpdateButton";
import styles from "./UserTasks.module.css";
import moment from "moment";
import { Link } from "react-router-dom";
import { preventDefault } from "../util/handler";
import { SignInForm } from "./PersonalPage";

const barStyles = ["success", "warning", "info", "danger"];
const getTasksByUser = (items: ITask[]) => _.groupBy(items, "assigned_to");
const getClosedTasks = (items: ITask[]) => items.filter(item => item.is_closed);
export const AvatarSquare: React.FC<AvatarProps> = props => {
  const src = props.src || `http://i.pravatar.cc/80?u=${Math.random()}`;
  return <Avatar {...props} src={src} square className="mr-1" />;
};
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
export const getSumCustomVal = (
  custom_value_map: ICustomValueMap,
  tasks: ITask[],
  id: number
) =>
  _.chain(tasks)
    .map(task => getCustomVal(custom_value_map, task, id))
    .sum()
    .value();

export const getCustomValVersion = (
  custon_value_map: ICustomValueMap,
  task: ITask
) => {
  if (custon_value_map.has(task)) {
    return _.get(custon_value_map.get(task), "version");
  } else {
    return undefined;
  }
};
export const isCustomValValid = (e: number, r: number, is_closed: boolean) =>
  is_closed && r === e;
export const isCustomValInvalid = (e: number, r: number) => r > e;
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
          <AvatarSquare src={imgSrc} /> {username}
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
        <AvatarSquare src={imgSrc} /> {username}
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
interface TaskProgressProps {
  tasks: ITask[];
}

export const TaskProgress: React.FC<TaskProgressProps> = ({ tasks }) => {
  const {
    state: { active_task_statuses, custom_eid, custom_value_map }
  } = useContext(RootContext);
  const [items, setItems] = useState<IProgressTotal[]>([]);
  const [allSum, setAllSum] = useState<number>(0);
  const eid = Number(custom_eid);
  useEffect(() => {
    const val = _.chain(active_task_statuses)
      .filter({ is_closed: true })
      .reverse()
      .map((item, idx) => ({
        status: item.id,
        total: getSumCustomVal(
          custom_value_map,
          _.filter(tasks, { status: item.id }),
          eid
        ),
        style: barStyles[idx],
        label: item.name
      }))
      .value();
    setItems(val);
  }, [active_task_statuses, eid, custom_value_map, setItems, tasks]);
  useEffect(() => {
    const val = getSumCustomVal(custom_value_map, tasks, eid);
    setAllSum(val);
  }, [eid, custom_value_map, setAllSum, tasks]);
  return (
    <Progress multi>
      {items.map(item => (
        <Progress
          key={item.label}
          bar
          max={allSum}
          value={item.total}
          color={item.style}
        >
          {item.label}
        </Progress>
      ))}
    </Progress>
  );
};
const UserRow = ({
  item,
  sums,
  isPast,
  total,
  hpd,
  tasks
}: {
  item: IUser;
  sums: { [key: string]: { e: number; r: number } };
  isPast: boolean;
  total: number;
  hpd: number;
  tasks: ITask[];
}) => {
  const [customTotal, setTotal] = useState<number>(0);
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
  return (
    <tr key={item.id}>
      {total > 0 ? (
        <>
          <NameAndWorkLoad
            username={item.username}
            val={e}
            total={margedTotal}
            imgSrc={item.photo}
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
            <AvatarSquare src={item.photo} />
            <Link to={`/${item.id}`}>{item.username}</Link>
          </td>
          <td className="text-right">{e}</td>
          <td className="text-right">{r}</td>
          <td>{_.isNumber(e) && <TaskProgress tasks={tasks} />}</td>
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
      tasks,
      custom_value_map,
      custom_attrs,
      custom_eid,
      custom_rid,
      biz_days,
      project: { members }
    }
  } = useContext(RootContext);
  const [hpd, setHpd] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const activeLen = biz_days.length - 1;
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setHpd(Number(e.target.value) || 0);
    },
    [setHpd]
  );
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
  const notAssignedSum = _.get(taskSumByUser, "null.e", 0);
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
        <Form inline={true} className="mr-auto" onSubmit={preventDefault}>
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
        <SignInForm />
        <UpdateButton />
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
          {(members || []).map(item => (
            <UserRow
              key={item.id}
              isPast={isPast}
              item={item}
              sums={taskSumByUser}
              total={total}
              hpd={hpd}
              tasks={tasksByUser[item.id] || []}
            />
          ))}
          <tr key="null">
            <td className="text-danger">
              <FontAwesomeIcon icon={faGhost} className="ml-1 mr-2 fa-lg" />
              Not assigned
            </td>
            <td className="text-right text-danger">{notAssignedSum}</td>
            <td />
            <td />
            {isPast ? <td /> : null}
          </tr>
        </tbody>
      </Table>
    </>
  );
};
