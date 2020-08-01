import React, { useContext, useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
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
  Spinner,
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
  faTasks,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import {
  TimerState,
  TimerMode,
  TimerDurationMin,
  timer,
  TimerEventListener,
} from "../util/timer";
import { RootContext } from "../Provider";
import { PomodoroHeatmap } from "./PomodoroHeatmap";
import { ActionTypes } from "../sideEffectors";
import { notify, NotifyClickHandler } from "../util/notify";
import { commonActions } from "../features/common/commonSlice";
import { alarmActions } from "../features/alarm/alarmSlice";

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
const clickToClose: NotifyClickHandler = (closeFn) => {
  timer.start();
  closeFn();
};
const clickToWaitClose: NotifyClickHandler = (closeFn) => {
  timer.start();
  closeFn(2);
};
const clickToChangeFocus: NotifyClickHandler = (closeFn) => {
  timer.changeMode(TimerMode.FOCUS);
  timer.start();
  closeFn();
};
export const Pomodoro: React.FC = () => {
  const dispatch = useDispatch();
  const {
    state: {
      loaded,
      pomodoro_date,
      pomodoro_number,
      pomodoro_used_number,
      task_id,
      task,
      auth_token,
      pomodoro_live_counts,
    },
    dispatch: xdispatch,
  } = useContext(RootContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [remaining, setRemaining] = useState(TimerDurationMin[TimerMode.FOCUS]);
  const [state, setState] = useState<TimerState>(TimerState.STOPPED);
  const [mode, setMode] = useState<TimerMode>(TimerMode.FOCUS);
  const [progress, setProgress] = useState(0);
  const [unit, setUnit] = useState("min");

  const toggleDropdown = useCallback(() => {
    setIsOpenDropdown((prev) => !prev);
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
    (status) => {
      setState(status.state);
      setRemainingAndUnit(status.remaining);
    },
    [setRemainingAndUnit]
  );
  const handleMode: TimerEventListener = useCallback(
    (status) => {
      setMode(status.mode);
      setRemainingAndUnit(status.duration);
    },
    [setRemainingAndUnit]
  );
  const handleTick: TimerEventListener = useCallback(
    (status) => {
      setRemainingAndUnit(status.remaining);
    },
    [setRemainingAndUnit]
  );
  const handleExpire: TimerEventListener = useCallback(
    (status, completedAt?: Date) => {
      let num = pomodoro_number;
      handleState(status);
      if (status.mode === TimerMode.FOCUS) {
        dispatch(alarmActions.play({ type: "end" }));
        xdispatch({
          type: ActionTypes.ADD_POMODORO,
          meta: {
            completedAt: completedAt || new Date(),
            duration: status.duration,
            pure: status.checkpointElapsed === 0,
          },
        });
        num++;
        if (num % 4 === 0) {
          timer.changeMode(TimerMode.LONG);
        } else {
          timer.changeMode(TimerMode.SHORT);
        }
        dispatch(commonActions.updateData());
      } else {
        dispatch(alarmActions.play({ type: "start" }));
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
        onDblclick,
      });
    },
    [xdispatch, handleState, pomodoro_number, dispatch]
  );
  const handleRetry = useCallback(() => {
    timer.changeMode(TimerMode.FOCUS, true);
  }, []);
  const handleRemove = useCallback(() => {
    xdispatch({ type: ActionTypes.RESET_TASK_ID });
  }, [xdispatch]);
  const handleAddFBTimer: TimerEventListener = useCallback(
    (status) => {
      let title: string = " from firebase!";
      let num = pomodoro_number;
      const { remaining } = status;

      if (status.mode === TimerMode.FOCUS) {
        num++;
        if (num % 4 === 0) {
          title = `Take a Long Break ${title}`;
        } else {
          title = `Take a Short Break ${title}`;
        }
      } else {
        title = `Start Focusing ${title}`;
      }
      const body = `${num} Pomodoros today!`;
      xdispatch({
        type: ActionTypes.ADD_FB_TIMER,
        payload: {
          title,
          body,
          remaining,
        },
      });
    },
    [xdispatch, pomodoro_number]
  );
  const handleDelFBTimer: TimerEventListener = useCallback(
    (status) => {
      xdispatch({
        type: ActionTypes.DEL_FB_TIMER,
      });
    },
    [xdispatch]
  );

  useEffect(() => {
    timer.on("tick", handleTick);
    timer.on("start", handleState);
    timer.on("start", handleAddFBTimer);
    timer.on("stop", handleState);
    timer.on("stop", handleDelFBTimer);
    timer.on("pause", handleState);
    timer.on("pause", handleDelFBTimer);
    timer.on("resume", handleState);
    timer.on("resume", handleAddFBTimer);
    timer.on("expire", handleExpire);
    timer.on("change_mode", handleMode);
    return () => {
      timer.removeAllListeners();
    };
  }, [
    handleExpire,
    handleMode,
    handleState,
    handleTick,
    handleAddFBTimer,
    handleDelFBTimer,
  ]);
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
      xdispatch({
        type: ActionTypes.RESET_POMODORO,
        payload: { pomodoro_date: today },
      });
      timer.changeMode(TimerMode.FOCUS);
    }
  }, [xdispatch, loaded, pomodoro_date]);
  useEffect(() => {
    if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);
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
          animation,
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
    xdispatch({
      type: ActionTypes.SET_POMODORO_STATE,
      payload: { pomodoro_state: state },
    });
  }, [xdispatch, state]);
  useEffect(() => {
    xdispatch({
      type: ActionTypes.SET_POMODORO_MODE,
      payload: { pomodoro_mode: mode },
    });
  }, [xdispatch, mode]);
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
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
  const displayLive = Object.values(pomodoro_live_counts).some(
    (val) => val > 0
  );
  return (
    <Card className={classNames(styles.top, "sticky-top")}>
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
                  "font-weight-bold": state === TimerState.RUNNING,
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
            {displayLive && (
              <div className="ml-1">
                <div
                  className={classNames(
                    "w-100",
                    "text-light",
                    "bg-danger",
                    "text-center",
                    "rounded",
                    "shadow",
                    "font-weight-bold",
                    styles.live
                  )}
                >
                  <FontAwesomeIcon
                    className="ml-1"
                    icon={faUserFriends}
                  ></FontAwesomeIcon>
                  <span className="mx-1">LIVE</span>
                </div>
                <div>
                  {Object.entries(pomodoro_live_counts)
                    .filter(([mode, val]) => val > 0)
                    .map(([mode, val]) => (
                      <Badge key={mode} color="light" className="border">
                        <TimerIcon mode={mode as TimerMode} />:{val}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </InputGroup>
          {pomodoro_number > 0 && (
            <Badge color="danger" className="mr-2">
              <Tomato /> <FontAwesomeIcon icon={faTimes} /> {pomodoro_number}
            </Badge>
          )}
          {_.times(pomodoro_number).map((i) => (
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
        <CardBody className="bg-grass">
          <PomodoroHeatmap />
        </CardBody>
      </Collapse>
    </Card>
  );
};
