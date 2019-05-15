import React, { useContext, useState, useCallback, useEffect } from "react";
import {
  Button,
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
  Form
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
  faUserTimes
} from "@fortawesome/free-solid-svg-icons";
import { InputGroupSpinner } from "./InputGroupSpinner";
import { RootContext } from "../Provider";
import {
  getCustomAttr,
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
      <a href={href} target="_blank" rel="noopener noreferrer" title={usName}>
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
  valid?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  loading?: boolean;
}
const ToggleNumberInput: React.FC<ToggleNumberInputProps> = ({
  label,
  value,
  onSubmit,
  valid,
  invalid,
  disabled,
  loading
}) => {
  const [checked, setChecked] = useState<boolean>(false);
  const [val, setVal] = useState("");
  const onChange = useCallback(
    (evt: React.FormEvent<any>) => {
      setChecked(evt.currentTarget.checked);
    },
    [setChecked]
  );
  const handleVal = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setVal(e.target.value);
    },
    [setVal]
  );
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      const num = Number(val);
      if (checked && val !== "" && num >= 0 && onSubmit) {
        onSubmit(num);
        setChecked(false);
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
                />
                <InputGroupAddon addonType="append">
                  <Button color="info">
                    <FontAwesomeIcon icon={faCloudUploadAlt} />
                  </Button>
                </InputGroupAddon>
              </>
            ) : (
              <Input valid={valid} invalid={invalid} readOnly value={value} />
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
    state: { custom_attrs, custom_eid, custom_value_map, auth_token },
    dispatch
  } = useContext(RootContext);
  const version = getCustomValVersion(custom_value_map, item);
  const onSubmitE = useCallback(
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
  const customAttrE = getCustomAttr(custom_attrs, Number(custom_eid));
  if (!customAttrE) {
    return null;
  }
  const e = getCustomVal(custom_value_map, item, customAttrE.id);
  const unEstimated = !e;
  const disabled = auth_token === "";
  const loading = !version;

  return (
    <ToggleNumberInput
      onSubmit={onSubmitE}
      label={customAttrE.name}
      value={e}
      invalid={unEstimated}
      disabled={disabled}
      loading={loading}
    />
  );
};

export const TaskItem = ({ item }: { item: ITask }) => {
  const {
    state: {
      custom_attrs,
      custom_eid,
      custom_rid,
      custom_value_map,
      auth_token
    },
    dispatch
  } = useContext(RootContext);
  const version = getCustomValVersion(custom_value_map, item);
  const onSubmitE = useCallback(
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
  const onSubmitR = useCallback(
    (value: number) => {
      if (version) {
        dispatch({
          type: ActionTypes.PATCH_CUSTOM_VALUE,
          payload: {
            id: item.id,
            key: custom_rid,
            value,
            version
          }
        });
      }
    },
    [custom_rid, dispatch, item.id, version]
  );
  const customAttrE = getCustomAttr(custom_attrs, Number(custom_eid));
  const customAttrR = getCustomAttr(custom_attrs, Number(custom_rid));
  if (!customAttrE || !customAttrR) {
    return null;
  }
  const e = getCustomVal(custom_value_map, item, customAttrE.id);
  const r = getCustomVal(custom_value_map, item, customAttrR.id);
  const unEstimated = !e;
  const valid = isCustomValValid(e, r, item.is_closed);
  const invalid = isCustomValInvalid(e, r);
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
        <TaskStatusSelector task={item} disabled={disabled} />
      </div>
      <Row>
        <Col>
          <ToggleNumberInput
            onSubmit={onSubmitE}
            label={customAttrE.name}
            value={e}
            invalid={unEstimated}
            disabled={disabled}
            loading={loading}
          />
        </Col>
        <Col>
          <ToggleNumberInput
            onSubmit={onSubmitR}
            label={customAttrR.name}
            value={r}
            valid={valid}
            invalid={invalid}
            disabled={disabled}
            loading={loading}
          />
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
