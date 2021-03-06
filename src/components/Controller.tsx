import React, { useContext, useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import _ from "lodash";
import classNames from "classnames";
import { settingActions, useSettingSelector } from "../features/setting/settingSlice";
import { RootContext } from "../Provider";
import {
  Card,
  CardHeader,
  Collapse,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  Button,
  Badge
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleRight,
  faExternalLinkAlt
} from "@fortawesome/free-solid-svg-icons";
import { stopPropagation } from "../util/handler";
import { ProjectSelector } from "./ProjectSelector";
import { MilestoneSelector } from "./MilestoneSelector";
import { CustomValuesSelector } from "./CustomValuesSelector";
import { DaysSelector } from "./DaysSelector";
import { TaskStatusSelector } from "./TaskStatusSelector";
import { TimelimitCloseTask } from "./TimelimitCloseTask";
import { IMilestone } from "../store";
import styles from "./Controller.module.css";
import { ActionTypes } from "../actions";
const getTaskboardUrl = (url: string, milestone: IMilestone) => {
  if (url && milestone.project_extra_info) {
    return `${url}/project/${milestone.project_extra_info.slug}/taskboard/${milestone.slug}`;
  } else {
    return "";
  }
};

const getRange = (biz_days: string[]) => {
  if (biz_days.length > 1) {
    return `[${_.head(biz_days)} - ${_.last(biz_days)}]`;
  } else {
    return "";
  }
};
export const ToggleIcon = ({ isOpen }: { isOpen: boolean }) => {
  const rotation = isOpen ? 90 : undefined;
  return (
    <FontAwesomeIcon
      className="text-muted mr-2"
      rotation={rotation}
      icon={faChevronCircleRight}
    />
  );
};
export const Controller: React.FC = () => {
  const dispatch = useDispatch()
  const stateUrl = useSettingSelector.useUrl()
  const {
    state: { isOpen, biz_days, milestone },
    dispatch: xdispatch
  } = useContext(RootContext);
  const [url, setUrl] = useState("");
  const handleUrl = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value);
    },
    [setUrl]
  );
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      if (url) {
        dispatch(settingActions.setUrl(url))
      }
      e.preventDefault();
    },
    [url, dispatch]
  );
  const toggle = useCallback(() => {
    if (isOpen) {
      xdispatch({ type: ActionTypes.CLOSE_CONTROLLER });
    } else {
      xdispatch({ type: ActionTypes.OPEN_CONTROLLER });
    }
  }, [xdispatch, isOpen]);
  const taskboardUrl = useMemo(() => getTaskboardUrl(stateUrl, milestone), [
    milestone,
    stateUrl
  ]);
  const spName = milestone.name;
  const range = useMemo(() => getRange(biz_days), [biz_days]);
  return (
    <Card>
      <CardHeader className={classNames(styles.header)} onClick={toggle}>
        <ToggleIcon isOpen={isOpen} />
        {spName && (
          <Badge color="primary" pill className="p-1 m-1">
            <span>{spName}</span>
          </Badge>
        )}
        {range && (
          <Badge className="p-1 m-1">
            <span>{range}</span>
          </Badge>
        )}
        {taskboardUrl ? (
          <a
            target="_blank"
            onClick={stopPropagation}
            className="float-right"
            href={taskboardUrl}
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon className="mr-1" icon={faExternalLinkAlt} />
            Taskboard
          </a>
        ) : null}
      </CardHeader>
      <Collapse isOpen={isOpen}>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputGroupAddon addonType="prepend">URL</InputGroupAddon>
            <Input
              defaultValue={stateUrl}
              onChange={handleUrl}
              placeholder="http://hostname:port"
            />
            <InputGroupAddon addonType="append">
              <Button>Set</Button>
            </InputGroupAddon>
          </InputGroup>
        </Form>
        <div className="row">
          <ProjectSelector />
          <MilestoneSelector />
        </div>
        <CustomValuesSelector />
        <TimelimitCloseTask />
        <DaysSelector />
        <TaskStatusSelector />
      </Collapse>
    </Card>
  );
};
