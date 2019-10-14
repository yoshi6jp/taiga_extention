import React,{  useContext,useCallback } from "react";
import { TaskItemProps } from "../UserStory";
import { RootContext } from "../../Provider";
import {ActionTypes  } from "../../actions";
import { TimerState, TimerMode,timer } from "../../util/timer";
import { Button } from "reactstrap";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { Tomato } from "../Tomato";
import styles from "./TaskTimerButton.module.css";
export const TaskTimerButton: React.FC<TaskItemProps> = ({ item }) => {
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
      timer.changeMode(TimerMode.FOCUS, true);
    } else {
      if (pomodoro_mode === TimerMode.FOCUS) {
        timer.resume();
      } else {
        timer.changeMode(TimerMode.FOCUS, true);
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
        <Button
          className={classNames("mr-2", styles.btn)}
          color="danger"
          onClick={handlePause}
        >
          <FontAwesomeIcon icon={faPause} />
          <Tomato />
        </Button>
      );
    } else {
      return (
        <Button
          onClick={handleStart}
          color="primary"
          className={classNames("mr-2", styles.btn)}
        >
          <FontAwesomeIcon icon={faPlay} />
          <Tomato />
        </Button>
      );
    }
  } else if (task_id === "") {
    if (
      pomodoro_mode === TimerMode.FOCUS &&
      pomodoro_state !== TimerState.STOPPED
    ) {
      return null;
    } else {
      return (
        <Button onClick={handleStart} color="primary" 
          className={classNames("mr-2", styles.btn)}
        >
          <FontAwesomeIcon icon={faPlay} />
          <Tomato />
        </Button>
      );
    }
  } else {
    return null;
  }
};