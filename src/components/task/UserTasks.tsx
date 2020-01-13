import React, { useCallback, useContext, useState, useMemo } from "react";
import { Avatar, AvatarProps } from "@rmwc/avatar";
import { ICustomValueMap, IUser, ITask } from "../../store";
import { RootContext } from "../../Provider";
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
import { UpdateButton } from "../UpdateButton";
import styles from "./UserTasks.module.css";
import moment from "moment";
import { Link } from "react-router-dom";
import { preventDefault } from "../../util/handler";
import { SignInForm } from "../SignInForm";

interface ISortedUser extends IUser {
  closed: number;
}
const barStyles = ["success", "warning", "info", "danger"];
const getTasksByUser = (items: ITask[]) => _.groupBy(items, "assigned_to");
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

const getSumCustomValClosed = (
  custom_value_map: ICustomValueMap,
  tasks: ITask[],
  id: number
) =>
  getSumCustomVal(
    custom_value_map,
    tasks.filter(item => item.is_closed),
    id
  );
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
interface UserLinkProps {
  photo: string;
  id: number;
  username: string;
  total_hours?: number;
}
const UserLink: React.FC<UserLinkProps> = ({ photo, id, username, total_hours }) => {
  let to = `/users/${id}`
  if (total_hours) {
    to = `${to}/${total_hours}`
  }
  return (
    <>
      <AvatarSquare src={photo} />
      <Link to={to}>{username}</Link>
    </>
  )
}

const NameAndWorkLoad = ({
  username,
  val,
  total,
  imgSrc, id
}: {
  username: string;
  val: number;
  total: number;
  imgSrc: string;
  id: number;
}) => {
  const [icon, tblCls] = useMemo(() => {
    const diff = total > 0 ? (val - total) / total : 0;
    if (diff < -0.1) {
      return [faGrinBeam, ""];
    } else if (diff <= 0.1) {
      return [faGrinBeam, "table-success"];
    } else if (diff <= 0.2) {
      return [faGrinBeamSweat, "table-warning"];
    } else {
      return [faDizzy, "table-danger"];
    }
  }, [total, val]);

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
  return (
    <>
      <td className={tblCls}>
        <UserLink id={id} photo={imgSrc} username={username} total_hours={total} />
        <FontAwesomeIcon className="mx-1" icon={icon} />
      </td>
      <td className={classNames(tblCls, "text-right")}>{val}</td>
    </>
  );
};

export const Medal = ({ e, r }: { e: number; r: number }) => {
  const [grade, num] = useMemo(() => getGrade(e, r), [e, r]);
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
  const eid = Number(custom_eid);
  const items = useMemo(
    () =>
      _.chain(active_task_statuses)
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
        .value(),
    [active_task_statuses, custom_value_map, eid, tasks]
  );

  const allSum = useMemo(() => getSumCustomVal(custom_value_map, tasks, eid), [
    custom_value_map,
    eid,
    tasks
  ]);

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
  item: ISortedUser;
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
  const mergedTotal = customTotal || total;
  const totalStr = String(mergedTotal);
  return (
    <tr key={item.id}>
      {total > 0 ? (
        <>
          <NameAndWorkLoad
            username={item.username}
            val={e}
            total={mergedTotal}
            imgSrc={item.photo}
            id={item.id}
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
              <UserLink photo={item.photo} id={item.id} username={item.username} />
            </td>
            <td className="text-right">{item.closed || ""}</td>
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
export const getTaskSumByUser = (
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
export const UserTasks = () => {
  const {
    state: {
      tasks,
      custom_value_map,
      custom_eid,
      custom_rid,
      biz_days,
      custom_attr_e,
      custom_attr_r,
      project: { members }
    }
  } = useContext(RootContext);
  const [hpd, setHpd] = useState<number>(0);
  const activeLen = biz_days.length - 1;
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setHpd(Number(e.target.value) || 0);
    },
    [setHpd]
  );
  const total = hpd * activeLen;
  const taskSumByUser = useMemo(
    () => getTaskSumByUser(tasks, custom_value_map, custom_eid, custom_rid),
    [custom_eid, custom_rid, custom_value_map, tasks]
  );
  const notAssignedSum = _.get(taskSumByUser, "null.e", 0);
  const isPlanning = total > 0;
  const isPast = useMemo(
    () =>
      !isPlanning &&
      moment().diff(
        moment(_.last(biz_days))
          .local()
          .endOf("days")
      ) > 0,
    [biz_days, isPlanning]
  );
  const tasksByUser = useMemo(() => getTasksByUser(tasks), [tasks]);
  const sortedMembers = useMemo(
    () =>
      _.chain(members)
        .reject(member => _.isEmpty(tasksByUser[member.id]))
        .map(member => ({
          ...member,
          closed: getSumCustomValClosed(
            custom_value_map,
            tasksByUser[member.id] || [],
            Number(custom_eid)
          )
        }))
        .sortBy("closed")
        .reverse()
        .value(),
    [custom_eid, custom_value_map, members, tasksByUser]
  );
  if (!custom_attr_e.id || !custom_attr_r.id || biz_days.length <= 1) {
    return null;
  }
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
            {!isPlanning && <th className="text-success">Completed</th>}
            <th>{custom_attr_e.name}</th>
            {isPlanning ? (
              <>
                <th>Total</th>
                <th>Custom</th>
              </>
            ) : (
                <>
                  <th>{custom_attr_r.name}</th>
                  <th>Progress</th>
                </>
              )}
            {isPast ? <th>Grade</th> : null}
          </tr>
        </thead>
        <tbody>
          {(sortedMembers || []).map(item => (
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
            {!isPlanning && <td />}
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
