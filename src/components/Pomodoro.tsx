import React, { useContext, useState, useCallback, useEffect } from "react";
import _ from "lodash";
import moment from "moment";
import {
  Card,
  CardHeader,
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faPlay,
  faPause,
  faRedo,
  faCookie
} from "@fortawesome/free-solid-svg-icons";
import {
  TimerState,
  TimerMode,
  TimerDurationMin,
  timer,
  TimerEventListener
} from "../util/timer";
import { RootContext } from "../Provider";
import { ActionTypes } from "../sideEffectors";

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
      auth_token
    },
    dispatch
  } = useContext(RootContext);
  const [isOpen, setIsOpen] = useState(false);
  const [remainingMin, setRemainingMin] = useState(
    TimerDurationMin[TimerMode.FOCUS]
  );
  const [state, setState] = useState<TimerState>(TimerState.STOPPED);
  const [mode, setMode] = useState<TimerMode>(TimerMode.FOCUS);
  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
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
    status => {
      handleState(status);
      if (status.mode === TimerMode.FOCUS) {
        dispatch({ type: ActionTypes.ADD_POMODORO });
        timer.changeMode(TimerMode.SHORT);
      } else {
        timer.changeMode(TimerMode.FOCUS);
      }
    },
    [dispatch, handleState]
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
  if (!auth_token) {
    return null;
  }
  return (
    <Card className={classNames(styles.top)}>
      <CardHeader>
        <div className="d-flex">
          <InputGroup className={classNames(styles.button_group)}>
            <InputGroupButtonDropdown
              isOpen={isOpen}
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
            <InputGroupAddon addonType="prepend">
              <InputGroupText
                className={classNames({
                  "font-weight-bold": state === TimerState.RUNNING
                })}
              >
                {remainingMin}
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupAddon addonType="prepend">min</InputGroupAddon>
            <InputGroupAddon addonType="append">
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
              <InputGroupAddon addonType="append">
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
          <Badge color="warning">Beta</Badge>
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
    </Card>
  );
};
