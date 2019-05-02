import React, { useCallback, useContext } from "react";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";
import { RootContext } from "./Provider";
import { ActionTypes } from "./actions";

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
          default:
            console.log("other id");
        }
      }
    },
    [dispatch]
  );
  return (
    <div className="row">
      <InputGroup className="col">
        <InputGroupAddon addonType="prepend">Estimate</InputGroupAddon>
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
      </InputGroup>
      <InputGroup className="col">
        <InputGroupAddon addonType="prepend">Result</InputGroupAddon>
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
      </InputGroup>
    </div>
  );
};
