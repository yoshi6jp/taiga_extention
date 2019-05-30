import React, { useContext, useState, useCallback, useEffect } from "react";
import _ from "lodash";
import moment from "moment";
import {
  Card,
  Collapse,
  CardHeader,
  CardBody,
  Badge,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupButtonDropdown,
  Button
} from "reactstrap";
import styles from "./Pomodoro.module.css";
import classNames from "classnames";
import { Tomato, TomatoState } from "./Tomato";
import { ToggleIcon } from "./Controller";
import tomatoIcon from "../tomato.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { stopPropagation } from "../util/handler";
import {
  faCoffee,
  faPlay,
  faPause,
  faRedo,
  faCookie,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import {
  TimerState,
  TimerMode,
  TimerDurationMin,
  timer,
  TimerEventListener
} from "../util/timer";
import { RootContext } from "../Provider";
import { PomodoroHeatmap } from "./PomodoroHeatmap";
import { ActionTypes } from "../sideEffectors";
const Favico = require("favico.js-slevomat");
const favico = new Favico({ animation: "fade" });

const secToMin = (seconds: number) => Math.ceil(seconds / 60);
interface TimerIconProps {
  mode: TimerMode;
}
const TimerIcon: React.FC<TimerIconProps> = ({ mode }) => {
  switch (mode) {
    case TimerMode.SHORT: {
      return <FontAwesomeIcon className="fa-fw" icon={faCoffee} />;
    }
    case TimerMode.LONG: {
      return <FontAwesomeIcon className="fa-fw" icon={faCookie} />;
    }
    default: {
      return <Tomato />;
    }
  }
};
interface TimerItemProps {
  mode: TimerMode;
  onSelect: (mode: TimerMode) => void;
}
const TimerItem: React.FC<TimerItemProps> = ({ mode, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect(mode);
  }, [mode, onSelect]);
  return (
    <DropdownItem onClick={handleClick}>
      <TimerIcon mode={mode} />
      {mode}
    </DropdownItem>
  );
};
export const Pomodoro: React.FC = () => {
  const {
    state: {
      loaded,
      pomodoro_date,
      pomodoro_number,
      pomodoro_used_number,
      auth_token,
      isNotifable
    },
    dispatch
  } = useContext(RootContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [remainingMin, setRemainingMin] = useState(
    TimerDurationMin[TimerMode.FOCUS]
  );
  const [state, setState] = useState<TimerState>(TimerState.STOPPED);
  const [mode, setMode] = useState<TimerMode>(TimerMode.FOCUS);
  const toggleDropdown = useCallback(() => {
    setIsOpenDropdown(prev => !prev);
  }, []);
  const handleSelect = useCallback((mode: TimerMode) => {
    timer.changeMode(mode);
  }, []);
  const handleClick = useCallback(() => {
    switch (state) {
      case TimerState.RUNNING: {
        timer.pause();
        break;
      }
      case TimerState.PAUSED: {
        timer.resume();
        break;
      }
      case TimerState.STOPPED: {
        timer.start();
      }
    }
  }, [state]);
  const handleState: TimerEventListener = useCallback(status => {
    setState(status.state);
    setRemainingMin(secToMin(status.remaining));
  }, []);
  const handleMode: TimerEventListener = useCallback(status => {
    setMode(status.mode);
    setRemainingMin(secToMin(status.duration));
  }, []);
  const handleTick: TimerEventListener = useCallback(status => {
    setRemainingMin(secToMin(status.remaining));
  }, []);
  const handleExpire: TimerEventListener = useCallback(
    (status, completedAt?: Date) => {
      let num = pomodoro_number;
      handleState(status);
      if (status.mode === TimerMode.FOCUS) {
        dispatch({
          type: ActionTypes.ADD_POMODORO,
          meta: {
            completedAt: completedAt || new Date(),
            duration: status.duration,
            pure: status.checkpointElapsed === 0
          }
        });
        num++;
        if (num % 4 === 0) {
          timer.changeMode(TimerMode.LONG);
        } else {
          timer.changeMode(TimerMode.SHORT);
        }
      } else {
        timer.changeMode(TimerMode.FOCUS);
      }
      if (isNotifable) {
        let title: string = "";
        let body: string;
        body = `${num} Pomodoros today!`;
        switch (timer.mode) {
          case TimerMode.FOCUS: {
            title = "Start Focusing.";
            break;
          }
          case TimerMode.SHORT: {
            title = "Take a Short Break.";
            break;
          }
          case TimerMode.LONG: {
            title = "Take a Long Break.";
            break;
          }
        }
        const notify = new Notification(title, {
          body,
          icon: tomatoIcon
        });
        notify.onclick = () => {
          timer.start();
          notify.close();
        };
      }
    },
    [dispatch, handleState, isNotifable, pomodoro_number]
  );
  const handleRetry = useCallback(() => {
    timer.changeMode(TimerMode.FOCUS);
    timer.start();
  }, []);
  useEffect(() => {
    timer.on("tick", handleTick);
    timer.on("start", handleState);
    timer.on("stop", handleState);
    timer.on("pause", handleState);
    timer.on("resume", handleState);
    timer.on("expire", handleExpire);
    timer.on("change_mode", handleMode);
    return () => {
      timer.removeAllListeners();
    };
  }, [handleExpire, handleMode, handleState, handleTick]);
  useEffect(() => {
    setMode(timer.mode);
    setState(timer.state);
    setRemainingMin(secToMin(timer.remaining));
    if (timer.restoreExpired) {
      handleExpire(timer.status);
      timer.restoreExpired = false;
    }
  }, [handleExpire]);
  useEffect(() => {
    const today = moment().format("YYYY-MM-DD");
    if (loaded && pomodoro_date !== today) {
      dispatch({
        type: ActionTypes.RESET_POMODORO,
        payload: { pomodoro_date: today }
      });
      timer.changeMode(TimerMode.FOCUS);
    }
  }, [dispatch, loaded, pomodoro_date]);
  useEffect(() => {
    if (Notification.permission !== "denied") {
      Notification.requestPermission(permission => {
        if (permission === "granted") {
          dispatch({ type: ActionTypes.ALLOW_NOTIFICATION });
        }
      });
    }
  }, [dispatch]);
  useEffect(() => {
    const bgColor = mode === TimerMode.FOCUS ? "#f00" : "#0f0";
    const textColor = mode === TimerMode.FOCUS ? "#fff" : "#000";
    const shape = mode === TimerMode.FOCUS ? "rectangle" : "circle";
    switch (state) {
      case TimerState.RUNNING: {
        favico.badge(remainingMin, { bgColor, textColor, type: shape });
        break;
      }
      case TimerState.PAUSED: {
        favico.badge("-", { bgColor, textColor, type: shape });
        break;
      }
      default: {
        favico.reset();
      }
    }
  }, [mode, remainingMin, state]);
  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  if (!auth_token) {
    return null;
  }
  return (
    <Card className={classNames(styles.top)}>
      <CardHeader onClick={handleToggle}>
        <div className="d-flex">
          <ToggleIcon isOpen={isOpen} />
          <InputGroup className={classNames(styles.button_group, "ml-1")}>
            <InputGroupButtonDropdown
              onClick={stopPropagation}
              isOpen={isOpenDropdown}
              toggle={toggleDropdown}
              addonType="prepend"
            >
              <DropdownToggle size="sm" caret>
                <TimerIcon mode={mode} />
              </DropdownToggle>
              <DropdownMenu>
                <TimerItem mode={TimerMode.FOCUS} onSelect={handleSelect} />
                <TimerItem mode={TimerMode.SHORT} onSelect={handleSelect} />
                <TimerItem mode={TimerMode.LONG} onSelect={handleSelect} />
              </DropdownMenu>
            </InputGroupButtonDropdown>
            <InputGroupAddon addonType="prepend" onClick={stopPropagation}>
              <InputGroupText
                className={classNames({
                  "font-weight-bold": state === TimerState.RUNNING
                })}
              >
                {remainingMin}
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupAddon onClick={stopPropagation} addonType="prepend">
              min
            </InputGroupAddon>
            <InputGroupAddon addonType="append" onClick={stopPropagation}>
              {state === TimerState.RUNNING ? (
                <Button color="danger" onClick={handleClick}>
                  <FontAwesomeIcon icon={faPause} />
                </Button>
              ) : (
                <Button color="primary" onClick={handleClick}>
                  <FontAwesomeIcon icon={faPlay} />
                </Button>
              )}
            </InputGroupAddon>

            {mode !== TimerMode.FOCUS && (
              <InputGroupAddon addonType="append" onClick={stopPropagation}>
                <Button
                  color="info"
                  onClick={handleRetry}
                  title="Retry focusing"
                >
                  <FontAwesomeIcon icon={faRedo} />
                  <Tomato />
                </Button>
              </InputGroupAddon>
            )}
          </InputGroup>
          {pomodoro_number > 0 && (
            <Badge color="danger" className="mr-2">
              <Tomato /> <FontAwesomeIcon icon={faTimes} /> {pomodoro_number}
            </Badge>
          )}
          {_.times(pomodoro_number).map(i => (
            <Tomato
              key={i}
              state={
                i < pomodoro_used_number ? TomatoState.STALE : TomatoState.FRESH
              }
            />
          ))}
        </div>
      </CardHeader>
      <Collapse isOpen={isOpen}>
        <CardBody>
          <PomodoroHeatmap />
        </CardBody>
      </Collapse>
    </Card>
  );
};
