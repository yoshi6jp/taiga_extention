import React, { useContext, useCallback, useState, useEffect } from "react";
import { Button, Form, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { RootContext } from "../Provider";
import { InputGroupSpinner } from "./InputGroupSpinner";
import { ActionTypes } from "../actions";
import _ from "lodash";
export const TimelimitCloseTask = () => {
  const {
    state: { timelimit_close_task },
    dispatch
  } = useContext(RootContext);
  const [datetime, setDatetime] = useState("");
  const [isFresh, setIsFresh] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDatetime(e.target.value);
  }, []);
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      datetime &&
        dispatch({
          type: ActionTypes.SET_TIMELIMIT_CLOSE_TASK,
          payload: { timelimit_close_task: datetime },
          meta: { customize: true }
        });
      e.preventDefault();
    },
    [datetime, dispatch]
  );
  useEffect(() => {
    if (timelimit_close_task) {
      setIsFresh(true);
      _.defer(setIsFresh, false);
    }
  }, [timelimit_close_task]);
  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          Timelimit for closing old tasks
        </InputGroupAddon>
        {isFresh ? (
          <InputGroupSpinner />
        ) : (
          <Input
            defaultValue={timelimit_close_task}
            onChange={handleChange}
            type="datetime-local"
          />
        )}
        <InputGroupAddon addonType="append">
          <Button>Set</Button>
        </InputGroupAddon>
      </InputGroup>
    </Form>
  );
};
