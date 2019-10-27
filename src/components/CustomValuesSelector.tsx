import React, { useCallback, useContext } from "react";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";
import { RootContext } from "../Provider";
import { ActionTypes } from "../actions";
import _ from "lodash";
import { LinearLoader } from "./common/LinearLoader";

export const CustomValuesSelector = () => {
  const {
    state: { custom_attrs, custom_eid, custom_rid },
    dispatch
  } = useContext(RootContext);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const id = e.target.value;
      if (id) {
        switch (e.target.name) {
          case "eid": {
            dispatch({
              type: ActionTypes.SET_CUSTOM_EID,
              payload: { custom_eid: id }
            });
            break;
          }
          case "rid": {
            dispatch({
              type: ActionTypes.SET_CUSTOM_RID,
              payload: { custom_rid: id }
            });
            break;
          }
        }
      }
    },
    [dispatch]
  );
  return (
    <div className="row">
      <InputGroup className="col">
        <InputGroupAddon addonType="prepend">Estimate</InputGroupAddon>
        {_.isEmpty(custom_attrs) ? (
          <LinearLoader></LinearLoader>
        ) : (
          <Input
            value={custom_eid}
            name="eid"
            type="select"
            onChange={handleChange}
          >
            <option value=""> --- </option>
            {custom_attrs.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Input>
        )}
      </InputGroup>
      <InputGroup className="col">
        <InputGroupAddon addonType="prepend">Result</InputGroupAddon>
        {_.isEmpty(custom_attrs) ? (
          <LinearLoader></LinearLoader>
        ) : (
          <Input
            value={custom_rid}
            name="rid"
            type="select"
            onChange={handleChange}
          >
            <option> --- </option>
            {custom_attrs.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Input>
        )}
      </InputGroup>
    </div>
  );
};
