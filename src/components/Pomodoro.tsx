import React, { useContext, useState, useCallback, useEffect } from "react";
import _ from "lodash";
import moment from "moment";
import { LinearProgress } from "@rmwc/linear-progress";
import { ThemeProvider } from "@rmwc/theme";
import { Chip, ChipSet } from "@rmwc/chip";
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
  Button,
  Spinner
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
  faTimes,
  faTasks
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
import { notify, NotifyClickHandler } from "../util/notify";
const Favico = require("favico.js-slevomat");
const favico = new Favico({ type: "rectangle" });
const secToMin = (seconds: number) => Math.ceil(seconds / 60);
interface TimerIconProps {
  mode: TimerMode;
}
const toValueAndUnit = (seconds: number): [number, string] =>
  seconds >= 60 ? [secToMin(seconds), "min"] : [Math.ceil(seconds), "sec"];
const TimerIcon: React.FC<TimerIconProps> = ({ mode }) => {
  switch (mode) {
    case TimerMode.SHORT: {
      return (
        <FontAwesomeIcon
          className={classNames("fa-fw", styles.short_break_icon)}
          icon={faCoffee}
        />
      );
    }
    case TimerMode.LONG: {
      return (
        <FontAwesomeIcon
          className={classNames("fa-fw", styles.long_break_icon)}
          icon={faCookie}
        />
      );
    }
    default: {
      return <Tomato state={TomatoState.FRESH} />;
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
const clickToClose: NotifyClickHandler = closeFn => {
  timer.start();
  closeFn();
};
const clickToWaitClose: NotifyClickHandler = closeFn => {
  timer.start();
  closeFn(2);
};
const clickToChangeFocus: NotifyClickHandler = closeFn => {
  timer.changeMode(TimerMode.FOCUS);
  timer.start();
  closeFn();
};
export const Pomodoro: React.FC = () => {
  const {
    state: {
      loaded,
      pomodoro_date,
      pomodoro_number,
      pomodoro_used_number,
      task_id,
      task,
      auth_token
    },
    dispatch
  } = useContext(RootContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [remaining, setRemaining] = useState(TimerDurationMin[TimerMode.FOCUS]);
  const [state, setState] = useState<TimerState>(TimerState.STOPPED);
  const [mode, setMode] = useState<TimerMode>(TimerMode.FOCUS);
  const [progress, setProgress] = useState(0);
  const [unit, setUnit] = useState("min");

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
  const setRemainingAndUnit = useCallback((seconds: number) => {
    const [val, unit] = toValueAndUnit(seconds);
    setRemaining(val);
    setUnit(unit);
  }, []);
  const handleState: TimerEventListener = useCallback(
    status => {
      setState(status.state);
      setRemainingAndUnit(status.remaining);
    },
    [setRemainingAndUnit]
  );
  const handleMode: TimerEventListener = useCallback(
    status => {
      setMode(status.mode);
      setRemainingAndUnit(status.duration);
    },
    [setRemainingAndUnit]
  );
  const handleTick: TimerEventListener = useCallback(
    status => {
      setRemainingAndUnit(status.remaining);
    },
    [setRemainingAndUnit]
  );
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
      let title: string = "";
      let body: string;
      let option: string | undefined = undefined;
      let onClick = clickToClose;
      let onDblclick: NotifyClickHandler | undefined = undefined;
      body = `${num} Pomodoros today!`;
      switch (timer.mode) {
        case TimerMode.FOCUS: {
          title = "Start Focusing.";
          break;
        }
        case TimerMode.SHORT: {
          title = "Take a Short Break.";
          option = "Retry focusing if double click.";
          onClick = clickToWaitClose;
          onDblclick = clickToChangeFocus;
          break;
        }
        case TimerMode.LONG: {
          title = "Take a Long Break.";
          option = "Retry focusing if double click.";
          onClick = clickToWaitClose;
          onDblclick = clickToChangeFocus;
          break;
        }
      }
      notify({
        title,
        body,
        option,
        icon: tomatoIcon,
        onClick,
        onDblclick
      });
    },
    [dispatch, handleState, pomodoro_number]
  );
  const handleRetry = useCallback(() => {
    timer.changeMode(TimerMode.FOCUS);
    timer.start();
  }, []);
  const handleRemove = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_TASK_ID });
  }, [dispatch]);
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
    setRemainingAndUnit(timer.remaining);
    if (timer.restoreExpired && auth_token) {
      _.defer(() => {
        handleExpire(timer.status);
      });
      timer.restoreExpired = false;
    }
  }, [auth_token, handleExpire, setRemainingAndUnit]);
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
      Notification.requestPermission();
    }
  }, [dispatch]);
  useEffect(() => {
    let bgColor = mode === TimerMode.FOCUS ? "#f00" : "#0f0";
    let textColor = mode === TimerMode.FOCUS ? "#fff" : "#000";
    let animation = "fade";
    if (unit === "sec") {
      [bgColor, textColor] = [textColor, bgColor];
      animation = "none";
    }
    switch (state) {
      case TimerState.RUNNING: {
        favico.badge(remaining, {
          bgColor,
          textColor,
          animation
        });
        break;
      }
      case TimerState.PAUSED: {
        favico.badge("-", { bgColor, textColor, animation });
        break;
      }
      default: {
        favico.reset();
      }
    }
  }, [mode, remaining, state, unit]);
  useEffect(() => {
    const duration = TimerDurationMin[mode] * 60;
    const val = unit === "min" ? remaining * 60 : remaining;
    setProgress(0.01 + ((duration - val) * 99) / duration / 100);
  }, [mode, remaining, unit]);
  useEffect(() => {
    dispatch({
      type: ActionTypes.SET_POMODORO_STATE,
      payload: { pomodoro_state: state }
    });
  }, [dispatch, state]);
  useEffect(() => {
    dispatch({
      type: ActionTypes.SET_POMODORO_MODE,
      payload: { pomodoro_mode: mode }
    });
  }, [dispatch, mode]);
  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  const buffer = state === TimerState.RUNNING ? progress : 1;
  if (!auth_token) {
    return null;
  }
  const taskTitle = task
    ? `#${task.ref} ${_.get(
        task,
        "user_story_extra_info.subject",
        "Unassigned tasks"
      )} / ${task.subject}`
    : "";
  const taskSubject = task
    ? _.truncate(`#${task.ref} ${task.subject}`, { length: 10 })
    : "";
  return (
    <Card className={classNames(styles.top)}>
      <ThemeProvider
        options={{ primary: mode === TimerMode.FOCUS ? "red" : "green" }}
      >
        <LinearProgress
          buffer={buffer}
          progress={progress}
          closed={state === TimerState.STOPPED}
        />
      </ThemeProvider>
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
              <DropdownToggle color="light" size="sm" caret>
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
                className={classNames(styles.fix_w, {
                  "font-weight-bold": state === TimerState.RUNNING
                })}
              >
                {remaining}
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupAddon onClick={stopPropagation} addonType="prepend">
              {unit}
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
                  color="light"
                  onClick={handleRetry}
                  title="Retry focusing"
                >
                  <FontAwesomeIcon icon={faRedo} className="text-muted" />
                  <Tomato state={TomatoState.STALE} />
                </Button>
              </InputGroupAddon>
            )}

            {task_id && (
              <ChipSet
                onClick={stopPropagation}
                className={classNames(styles.chip_set)}
              >
                <Chip
                  icon={<FontAwesomeIcon icon={faTasks} />}
                  onRemove={handleRemove}
                  title={taskTitle}
                  trailingIcon={<FontAwesomeIcon icon={faTimes} />}
                >
                  {taskSubject ? taskSubject : <Spinner type="grow" />}
                </Chip>
              </ChipSet>
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
              br={i % 2 !== pomodoro_number % 2 && i < pomodoro_number - 1}
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
