import React, { useContext, useState, useCallback } from "react";
import _ from "lodash";
import classNames from "classnames";
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
import { DaysSelector, getMilestone } from "./DaysSelector";
import { TaskStatusSelector } from "./TaskStatusSelector";
import { IMilestone } from "../store";
import styles from "./Controller.module.css";
import { ActionTypes } from "../actions";
const getSpName = (mid: string, items: IMilestone[]) =>
  _.get(getMilestone(mid, items), "name", "");
const getTaskboardUrl = (url: string, mid: string, items: IMilestone[]) => {
  const milestone = getMilestone(mid, items);
  if (url && milestone) {
    return `${url}/project/${milestone.project_extra_info.slug}/taskboard/${
      milestone.slug
    }`;
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
export const Controller = () => {
  const {
    state: { url: stateUrl, isOpen, mid, milestones, biz_days },
    dispatch
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
        dispatch({ type: ActionTypes.SET_URL, payload: { url } });
      }
      e.preventDefault();
    },
    [url, dispatch]
  );
  const toggle = useCallback(() => {
    if (isOpen) {
      dispatch({ type: ActionTypes.CLOSE_CONTROLLER });
    } else {
      dispatch({ type: ActionTypes.OPEN_CONTROLLER });
    }
  }, [dispatch, isOpen]);
  const taskboardUrl = getTaskboardUrl(stateUrl, mid, milestones);
  return (
    <Card>
      <CardHeader className={classNames(styles.header)} onClick={toggle}>
        <ToggleIcon isOpen={isOpen} />
        <Badge color="primary" pill className="p-1 m-1">
          <span>{getSpName(mid, milestones)}</span>
        </Badge>
        <Badge className="p-1 m-1">
          <span>{getRange(biz_days)}</span>
        </Badge>
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
        <DaysSelector />
        <TaskStatusSelector />
      </Collapse>
    </Card>
  );
};
