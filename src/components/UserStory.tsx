import React, {
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo
} from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  Collapse,
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Spinner,
  Form,
  Popover,
  PopoverHeader,
  PopoverBody
} from "reactstrap";
import classNames from "classnames";
import {
  ITasksByUserStory,
  ITask,
  ITaskStatus,
  IUserStoryExtraInfo,
  IProjectExtraInfo,
  IUser
} from "../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExternalLinkAlt,
  faCloudUploadAlt,
  faEdit,
  faHandPointRight,
  faUserTimes,
  faPlus,
  faMinus,
  faEraser,
  faPause,
  faPlay
} from "@fortawesome/free-solid-svg-icons";
import { InputGroupSpinner } from "./InputGroupSpinner";
import { RootContext } from "../Provider";
import { Tomato, TomatoState } from "./Tomato";
import {
  getCustomVal,
  getCustomValVersion,
  isCustomValInvalid,
  isCustomValValid,
  Medal,
  AvatarSquare
} from "./UserTasks";
import { ToggleIcon } from "./Controller";
import ListGroup from "reactstrap/lib/ListGroup";
import ListGroupItem from "reactstrap/lib/ListGroupItem";
import styles from "./UserStory.module.css";
import { Switch } from "@rmwc/switch";
import InputGroupText from "reactstrap/lib/InputGroupText";
import { ActionTypes } from "../actions";
import _ from "lodash";
import { stopPropagation } from "../util/handler";
import { timer, TimerMode, TimerState } from "../util/timer";
export const convToTasksByUserStory = (tasks: ITask[]) =>
  _.chain(tasks)
    .groupBy("user_story")
    .map((items, key) => ({
      user_story: Number(key),
      user_story_extra_info: items[0].user_story_extra_info,
      project_extra_info: items[0].project_extra_info,
      tasks: items,
      is_closed: items.every(task => task.is_closed)
    }))
    .value();
const needAuthMsg = (disabled: boolean | undefined) =>
  disabled ? "Need sign in!" : "";
const UserStoryLink = ({
  user_story_extra_info,
  project_extra_info
}: {
  user_story_extra_info: IUserStoryExtraInfo;
  project_extra_info: IProjectExtraInfo;
}) => {
  const {
    state: { url }
  } = useContext(RootContext);
  const { slug } = project_extra_info;
  const usName = user_story_extra_info
    ? `#${user_story_extra_info.ref} ${user_story_extra_info.subject}`
    : undefined;
  const href = user_story_extra_info
    ? `${url}/project/${slug}/us/${user_story_extra_info.ref}`
    : "#";

  if (usName) {
    return (
      <a
        href={href}
        onClick={stopPropagation}
        target="_blank"
        rel="noopener noreferrer"
        title={usName}
      >
        <FontAwesomeIcon icon={faExternalLinkAlt} /> {usName}
      </a>
    );
  } else {
    return <>(Unassigned tasks)</>;
  }
};

const TaskLink = ({ item }: { item: ITask }) => {
  const {
    state: { url }
  } = useContext(RootContext);
  const taskName = `#${item.ref} ${item.subject}`;
  const href = `${url}/project/${item.project_extra_info.slug}/task/${
    item.ref
  }`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" title={taskName}>
      <FontAwesomeIcon icon={faExternalLinkAlt} /> {taskName}
    </a>
  );
};

interface ToggleNumberInputProps {
  label: string;
  value: number;
  onSubmit?: (value: number) => void;
  onEditable?: (value: boolean) => void;
  onValueChange?: (value: number) => void;
  valid?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  loading?: boolean;
  id?: string;
  submitting?: boolean;
}
const ToggleNumberInput: React.FC<ToggleNumberInputProps> = ({
  label,
  value,
  onSubmit,
  onEditable,
  onValueChange,
  valid,
  invalid,
  disabled,
  loading,
  id,
  submitting
}) => {
  const [checked, setChecked] = useState(false);
  const [val, setVal] = useState("");
  const [running, setRunning] = useState(false);
  const onChange = useCallback(
    (evt: React.FormEvent<any>) => {
      setChecked(evt.currentTarget.checked);
    },
    [setChecked]
  );
  const handleVal = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setVal(value);
      onValueChange && onValueChange(Number(value));
    },
    [onValueChange]
  );
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      const num = Number(val);
      if (checked && val !== "" && num >= 0 && onSubmit) {
        onSubmit(num);
        setChecked(false);
        setRunning(true);
      }
      e.preventDefault();
    },
    [checked, val, onSubmit, setChecked]
  );
  useEffect(() => {
    if (disabled) {
      setChecked(false);
    }
  }, [setChecked, disabled]);
  useEffect(() => {
    setRunning(false);
  }, [value]);
  useEffect(() => {
    onEditable && onEditable(checked);
  }, [checked, onEditable]);
  useEffect(() => {
    if (submitting) {
      setChecked(false);
      setRunning(true);
    }
  }, [submitting]);
  useEffect(() => {
    if (loading) {
      setChecked(false);
    }
  }, [loading]);
  const title = needAuthMsg(disabled);
  return (
    <Form inline onSubmit={handleSubmit}>
      <InputGroup className={styles.toggle_input}>
        <InputGroupAddon addonType="prepend">{label}</InputGroupAddon>
        {loading ? (
          <InputGroupSpinner />
        ) : (
          <>
            {checked ? (
              <>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>{value}</InputGroupText>
                </InputGroupAddon>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <FontAwesomeIcon
                      className="text-info"
                      icon={faHandPointRight}
                    />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  onInput={handleVal}
                  onChange={handleVal}
                  defaultValue={String(value)}
                  type="number"
                  step="0.5"
                  min="0"
                  id={id}
                />
                <InputGroupAddon addonType="append">
                  <Button color="info">
                    <FontAwesomeIcon icon={faCloudUploadAlt} />
                  </Button>
                </InputGroupAddon>
              </>
            ) : (
              <>
                {running ? (
                  <InputGroupSpinner />
                ) : (
                  <Input
                    valid={valid}
                    invalid={invalid}
                    readOnly
                    value={value}
                  />
                )}
              </>
            )}
            <InputGroupAddon addonType="append" title={title}>
              <Switch disabled={disabled} checked={checked} onChange={onChange}>
                <FontAwesomeIcon className="text-info" icon={faEdit} />
              </Switch>
            </InputGroupAddon>
          </>
        )}
      </InputGroup>
    </Form>
  );
};
interface GradeProps {
  e: number;
  r: number;
}
export const Grade: React.FC<GradeProps> = ({ e, r }) => {
  return (
    <InputGroup className={styles.display_medal}>
      <InputGroupAddon addonType="prepend">Grade</InputGroupAddon>
      <InputGroupText className={styles.medal}>
        <Medal e={e} r={r} />
      </InputGroupText>
    </InputGroup>
  );
};

interface TaskStatusItemProps {
  item: ITaskStatus;
  task: ITask;
  onSelect?: (id: number) => void;
}
const TaskStatusItem: React.FC<TaskStatusItemProps> = ({
  item,
  task,
  onSelect
}) => {
  const { dispatch } = useContext(RootContext);
  const handleClick = useCallback(() => {
    dispatch({
      type: ActionTypes.PATCH_TASK,
      payload: {
        key: "status",
        value: item.id,
        id: task.id
      }
    });
    onSelect && onSelect(item.id);
  }, [dispatch, item.id, task.id, onSelect]);
  return <DropdownItem onClick={handleClick}>{item.name}</DropdownItem>;
};
interface TaskStatusSelectorProps {
  task: ITask;
  disabled?: boolean;
}
const TaskStatusSelector: React.FC<TaskStatusSelectorProps> = ({
  task,
  disabled
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    state: { active_task_statuses }
  } = useContext(RootContext);
  const handleSelect = useCallback(() => {
    setLoading(true);
  }, [setLoading]);
  useEffect(() => {
    setLoading(false);
  }, [task.version, setLoading]);
  return (
    <>
      {loading ? (
        <Spinner type="grow" color="info" />
      ) : (
        <UncontrolledDropdown>
          <DropdownToggle
            title={needAuthMsg(disabled)}
            disabled={disabled}
            caret={!disabled}
          >
            {task.status_extra_info.name}
          </DropdownToggle>
          <DropdownMenu>
            {active_task_statuses.map(item => (
              <TaskStatusItem
                item={item}
                key={item.id}
                task={task}
                onSelect={handleSelect}
              />
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      )}
    </>
  );
};
interface UserItemProps {
  item: IUser;
  onSelect?: (id: number) => void;
}
const UserItem: React.FC<UserItemProps> = ({ item, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect && onSelect(item.id);
  }, [item.id, onSelect]);
  return (
    <DropdownItem onClick={handleClick}>
      <AvatarSquare src={item.photo} />
      {item.username}
    </DropdownItem>
  );
};
interface TaskUserSelectorProps {
  task: ITask;
  disabled?: boolean;
}
export const TaskUserSelector: React.FC<TaskUserSelectorProps> = ({
  task,
  disabled
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    state: {
      project: { members }
    },
    dispatch
  } = useContext(RootContext);
  const handleSelect = useCallback(
    (id: number) => {
      setLoading(true);
      dispatch({
        type: ActionTypes.PATCH_TASK,
        payload: {
          key: "assigned_to",
          value: id,
          id: task.id
        }
      });
    },
    [dispatch, task.id]
  );
  useEffect(() => {
    setLoading(false);
  }, [task.version, setLoading]);
  return (
    <>
      {loading ? (
        <Spinner type="grow" color="info" />
      ) : (
        <UncontrolledDropdown>
          <DropdownToggle
            title={needAuthMsg(disabled)}
            size="sm"
            disabled={disabled}
            caret={!disabled}
          >
            Assign To
          </DropdownToggle>
          <DropdownMenu>
            {(members || []).map(item => (
              <UserItem item={item} onSelect={handleSelect} key={item.id} />
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      )}
    </>
  );
};
interface NotAssignedButtonProps {
  task: ITask;
}
const NotAssignedButton: React.FC<NotAssignedButtonProps> = ({ task }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { dispatch } = useContext(RootContext);
  const handleClick = useCallback(() => {
    setLoading(true);
    dispatch({
      type: ActionTypes.PATCH_TASK,
      payload: {
        key: "assigned_to",
        value: null,
        id: task.id
      }
    });
  }, [dispatch, task.id]);
  useEffect(() => {
    setLoading(false);
  }, [task.version, setLoading]);
  return (
    <>
      {loading ? (
        <Spinner type="grow" color="danger" />
      ) : (
        <Button
          className="mr-2"
          title="Not assigned"
          color="danger"
          onClick={handleClick}
        >
          <FontAwesomeIcon icon={faUserTimes} />
        </Button>
      )}
    </>
  );
};
interface CustomValueInputProps {
  item: ITask;
}

const EstimateInput: React.FC<CustomValueInputProps> = ({ item }) => {
  const {
    state: { custom_eid, custom_value_map, auth_token, custom_attr_e },
    dispatch
  } = useContext(RootContext);
  const version = getCustomValVersion(custom_value_map, item);
  const handleSubmit = useCallback(
    (value: number) => {
      if (version) {
        dispatch({
          type: ActionTypes.PATCH_CUSTOM_VALUE,
          payload: {
            id: item.id,
            key: custom_eid,
            value,
            version
          }
        });
      }
    },
    [dispatch, item.id, custom_eid, version]
  );
  const e = useMemo(
    () => getCustomVal(custom_value_map, item, custom_attr_e.id),
    [custom_attr_e.id, custom_value_map, item]
  );
  if (!custom_attr_e.id) {
    return null;
  }
  const unEstimated = !e;
  const disabled = auth_token === "";
  const loading = !version;

  return (
    <ToggleNumberInput
      onSubmit={handleSubmit}
      label={custom_attr_e.name}
      value={e}
      invalid={unEstimated}
      disabled={disabled}
      loading={loading}
    />
  );
};
const ResultInput: React.FC<CustomValueInputProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [used_number, set_used_number] = useState(0);
  const [editable, setEditable] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    state: {
      custom_rid,
      custom_value_map,
      custom_attr_e,
      custom_attr_r,
      auth_token,
      pomodoro_number,
      pomodoro_used_number
    },
    dispatch
  } = useContext(RootContext);
  const version = getCustomValVersion(custom_value_map, item);
  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  const handleSubmit = useCallback(
    (value: number, used_number?: number) => {
      if (version) {
        dispatch({
          type: ActionTypes.PATCH_CUSTOM_VALUE,
          payload: {
            id: item.id,
            key: custom_rid,
            value,
            version
          },
          meta: used_number ? { use_pomodoro: { used_number } } : undefined
        });
        setSubmitting(true);
      }
    },
    [custom_rid, dispatch, item.id, version]
  );
  const handlePluse = useCallback(() => {
    set_used_number(used_number + 1);
  }, [used_number]);
  const handleMinus = useCallback(() => {
    set_used_number(used_number - 1);
  }, [used_number]);

  const handleReset = useCallback(() => {
    set_used_number(0);
  }, []);
  const handleEditable = useCallback((val: boolean) => {
    setEditable(val);
  }, []);
  const e = useMemo(
    () => getCustomVal(custom_value_map, item, custom_attr_e.id),
    [custom_attr_e.id, custom_value_map, item]
  );
  const r = useMemo(
    () => getCustomVal(custom_value_map, item, custom_attr_r.id),
    [custom_attr_r.id, custom_value_map, item]
  );
  const handleValueChange = useCallback(
    (val: number) => {
      setEditable(r === val);
    },
    [r]
  );
  const handleUsePomodoro = useCallback(() => {
    const result = r + used_number / 2;
    handleSubmit(result, used_number);
    setIsOpen(false);
    set_used_number(0);
  }, [handleSubmit, r, used_number]);

  const valid = useMemo(() => isCustomValValid(e, r, item.is_closed), [
    e,
    item.is_closed,
    r
  ]);
  const invalid = useMemo(() => isCustomValInvalid(e, r), [e, r]);
  useEffect(() => {
    if (!version) {
      setSubmitting(false);
    }
  }, [version]);
  useEffect(() => {
    set_used_number(0);
  }, [pomodoro_used_number]);
  if (!custom_attr_r.id) {
    return null;
  }

  const disabled = auth_token === "";
  const loading = !version;
  const elId = `rusult-input-${item.id}`;
  const usableNumber = pomodoro_number - pomodoro_used_number;
  const submittable = used_number > 0;
  const isMax = used_number === usableNumber;
  return (
    <>
      <ToggleNumberInput
        onSubmit={handleSubmit}
        onEditable={handleEditable}
        onValueChange={handleValueChange}
        label={custom_attr_r.name}
        value={r}
        valid={valid}
        invalid={invalid}
        disabled={disabled}
        loading={loading}
        id={elId}
        submitting={submitting}
      />
      {editable && usableNumber > 0 && (
        <Popover
          className={classNames("popover-wide")}
          target={elId}
          placement="top"
          isOpen={isOpen}
          toggle={handleToggle}
          trigger="click hover"
        >
          <PopoverHeader>Pomodoro</PopoverHeader>
          <PopoverBody>
            <ButtonGroup>
              <Button disabled={isMax} onClick={handlePluse}>
                <FontAwesomeIcon icon={faPlus} />
              </Button>
              <Button disabled={!submittable} onClick={handleMinus}>
                <FontAwesomeIcon icon={faMinus} />
              </Button>
              <Button disabled className="bg-light">
                {_.times(usableNumber).map(i => (
                  <Tomato
                    key={i}
                    state={
                      i >= used_number ? TomatoState.FRESH : TomatoState.STALE
                    }
                  />
                ))}
              </Button>
              <Button disabled={!submittable} onClick={handleUsePomodoro}>
                <FontAwesomeIcon icon={faCloudUploadAlt} />
              </Button>
              <Button disabled={!submittable} onClick={handleReset}>
                <FontAwesomeIcon icon={faEraser} />
              </Button>
            </ButtonGroup>
          </PopoverBody>
        </Popover>
      )}
    </>
  );
};
interface TaskItemProps {
  item: ITask;
}

const TaskTimerButton: React.FC<TaskItemProps> = ({ item }) => {
  const {
    state: { task_id, pomodoro_mode, pomodoro_state },
    dispatch
  } = useContext(RootContext);
  const handleStart = useCallback(() => {
    if (Number(task_id) !== item.id) {
      dispatch({
        type: ActionTypes.SET_TASK_ID,
        payload: { task_id: String(item.id) }
      });
    }
    if (pomodoro_state === TimerState.STOPPED) {
      timer.changeMode(TimerMode.FOCUS);
      timer.start();
    } else {
      if (pomodoro_mode === TimerMode.FOCUS) {
        timer.resume();
      } else {
        timer.changeMode(TimerMode.FOCUS);
        timer.start();
      }
    }
  }, [dispatch, item.id, pomodoro_mode, pomodoro_state, task_id]);
  const handlePause = useCallback(() => {
    timer.pause();
  }, []);
  if (Number(task_id) === item.id) {
    if (
      pomodoro_mode === TimerMode.FOCUS &&
      pomodoro_state === TimerState.RUNNING
    ) {
      return (
        <Button className="mr-2" color="danger" onClick={handlePause}>
          <FontAwesomeIcon icon={faPause} />
          <Tomato />
        </Button>
      );
    } else {
      return (
        <Button onClick={handleStart} color="primary" className="mr-2">
          <FontAwesomeIcon icon={faPlay} />
          <Tomato />
        </Button>
      );
    }
  } else if (task_id === "" && !item.is_closed) {
    if (
      pomodoro_mode === TimerMode.FOCUS &&
      pomodoro_state !== TimerState.STOPPED
    ) {
      return null;
    } else {
      return (
        <Button onClick={handleStart} color="primary" className="mr-2">
          <FontAwesomeIcon icon={faPlay} />
          <Tomato />
        </Button>
      );
    }
  } else {
    return null;
  }
};
export const TaskItem: React.FC<TaskItemProps> = ({ item }) => {
  const {
    state: { custom_value_map, custom_attr_e, custom_attr_r, auth_token }
  } = useContext(RootContext);
  const version = useMemo(() => getCustomValVersion(custom_value_map, item), [
    custom_value_map,
    item
  ]);
  const e = useMemo(
    () => getCustomVal(custom_value_map, item, custom_attr_e.id),
    [custom_attr_e.id, custom_value_map, item]
  );
  const r = useMemo(
    () => getCustomVal(custom_value_map, item, custom_attr_r.id),
    [custom_attr_r.id, custom_value_map, item]
  );
  if (!custom_attr_e.id || !custom_attr_r.id) {
    return null;
  }

  const disabled = auth_token === "";
  const loading = !version;
  const inactive = r === 0 && !item.is_closed && !disabled && !loading;
  return (
    <ListGroupItem
      className={classNames({ [styles.is_closed]: item.is_closed })}
    >
      <div className="d-flex mb-1">
        <div className="mr-auto text-truncate">
          <TaskLink item={item} />
        </div>
        {inactive && <NotAssignedButton task={item} />}
        <TaskTimerButton item={item} />
        <TaskStatusSelector task={item} disabled={disabled} />
      </div>
      <Row>
        <Col>
          <EstimateInput item={item} />
        </Col>
        <Col>
          <ResultInput item={item} />
        </Col>
        <Col>
          <Grade e={e} r={r} />
        </Col>
      </Row>
    </ListGroupItem>
  );
};
interface UserStoryProps {
  item: ITasksByUserStory;
}
export const UserStoryWithEstimate: React.FC<UserStoryProps> = ({ item }) => {
  return (
    <Card>
      <CardHeader className="text-truncate">
        <UserStoryLink
          user_story_extra_info={item.user_story_extra_info}
          project_extra_info={item.project_extra_info}
        />
      </CardHeader>
      <ListGroup>
        {item.tasks.map(task => (
          <ListGroupItem key={task.id} className="text-truncate">
            <div className="d-flex">
              <div className="mr-auto text-truncate">
                <TaskLink item={task} />
              </div>
              <EstimateInput item={task} />
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
    </Card>
  );
};
export const UserStoryWithTaskUser: React.FC<UserStoryProps> = ({ item }) => {
  const {
    state: { auth_token }
  } = useContext(RootContext);
  const disabled = auth_token === "";
  return (
    <Card>
      <CardHeader className="text-truncate">
        <UserStoryLink
          user_story_extra_info={item.user_story_extra_info}
          project_extra_info={item.project_extra_info}
        />
      </CardHeader>
      <Collapse isOpen={true}>
        <ListGroup>
          {item.tasks.map(task => (
            <ListGroupItem key={task.id}>
              <div className="d-flex">
                <div className="mr-auto text-truncate">
                  <TaskLink item={task} />
                </div>
                <TaskUserSelector task={task} disabled={disabled} />
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
      </Collapse>
    </Card>
  );
};

export const UserStory: React.FC<UserStoryProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);
  useEffect(() => {
    setIsOpen(!item.is_closed);
  }, [item.is_closed, setIsOpen]);
  return (
    <Card>
      <CardHeader
        className={classNames(styles.header, "text-truncate", {
          "alert-primary": item.is_closed
        })}
        onClick={toggle}
      >
        <ToggleIcon isOpen={isOpen} />
        <UserStoryLink
          user_story_extra_info={item.user_story_extra_info}
          project_extra_info={item.project_extra_info}
        />
      </CardHeader>
      <Collapse isOpen={isOpen}>
        <ListGroup>
          {item.tasks.map(task => (
            <TaskItem item={task} key={task.id} />
          ))}
        </ListGroup>
      </Collapse>
    </Card>
  );
};
