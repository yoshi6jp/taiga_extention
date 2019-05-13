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
import { ITasksByUserStory, ITask, ITaskStatus } from "../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExternalLinkAlt,
  faCloudUploadAlt,
  faEdit,
  faHandPointRight
} from "@fortawesome/free-solid-svg-icons";
import { InputGroupSpinner } from "./InputGroupSpinner";
import { RootContext } from "../Provider";
import {
  getCustomAttr,
  getCustomVal,
  getCustomValVersion,
  isCustomValInvalid,
  isCustomValValid,
  Medal
} from "./UserTasks";
import { ToggleIcon } from "./Controller";
import ListGroup from "reactstrap/lib/ListGroup";
import ListGroupItem from "reactstrap/lib/ListGroupItem";
import styles from "./UserStory.module.css";
import { Switch } from "@rmwc/switch";
import InputGroupText from "reactstrap/lib/InputGroupText";
import { ActionTypes } from "../actions";
const UserStoryLink = ({ url, item }: { url: string; item: ITask }) => {
  const {
    user_story_extra_info,
    project_extra_info: { slug }
  } = item;
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

const TaskLink = ({ url, item }: { url: string; item: ITask }) => {
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
  const title = disabled ? "Need sign in!" : "";
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
          <DropdownToggle disabled={disabled} caret={!disabled}>
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

export const TaskItem = ({ item }: { item: ITask }) => {
  const {
    state: {
      url,
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
  return (
    <ListGroupItem
      className={classNames({ [styles.is_closed]: item.is_closed })}
    >
      <div className="d-flex mb-1">
        <div className="mr-auto text-truncate">
          <TaskLink url={url} item={item} />
        </div>
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
export const UserStory = ({ item }: { item: ITasksByUserStory }) => {
  const {
    state: { url }
  } = useContext(RootContext);
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
          [styles.is_closed]: item.is_closed
        })}
        onClick={toggle}
      >
        <ToggleIcon isOpen={isOpen} />
        <UserStoryLink url={url} item={item.tasks[0]} />
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
