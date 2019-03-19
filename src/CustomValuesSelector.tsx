import React, { useCallback, useEffect, useContext, useState } from "react";
import axios from "axios";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";
import { ITask, ICustomValue, ICustomAttr } from "./store";
import { RootContext, baseUrl } from "./Provider";

export const CustomValuesSelector = () => {
  const {
    state: { url, pid, custom_eid: stateEid, custom_rid: stateRid, tasks },
    setCustomEid,
    setCustomRid,
    setCustomAttrs,
    setCustomValueMap
  } = useContext(RootContext);
  const [items, setItems] = useState<ICustomAttr[]>([]);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const id = e.target.value;
      if (id) {
        switch (e.target.name) {
          case "eid": {
            setCustomEid(id);
            break;
          }
          case "rid": {
            setCustomRid(id);
            break;
          }
          default:
            console.log("other id");
        }
      }
    },
    [setCustomEid, setCustomRid]
  );
  useEffect(() => {
    if (url && pid) {
      (async () => {
        const { data: items } = await axios.get(
          `${baseUrl(url)}/task-custom-attributes`,
          { params: { project: pid } }
        );
        setItems(items);
        setCustomAttrs(items);
      })();
    }
  }, [url, pid]);
  useEffect(() => {
    if (url && tasks.length && stateEid && stateRid) {
      (async () => {
        const wmap = new WeakMap(
          await Promise.all(
            tasks.map(async item => {
              const { data: custom_attr_val } = await axios.get(
                `${baseUrl(url)}/tasks/custom-attributes-values/${item.id}`
              );
              return [item, custom_attr_val] as [ITask, ICustomValue];
            })
          )
        );
        setCustomValueMap(wmap);
      })();
    }
  }, [url, tasks]);

  return (
    <div className="row">
      <InputGroup className="col">
        <InputGroupAddon addonType="prepend">Estimate</InputGroupAddon>
        <Input
          value={stateEid}
          name="eid"
          type="select"
          onChange={handleChange}
        >
          <option value=""> --- </option>
          {items.map(item => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Input>
      </InputGroup>
      <InputGroup className="col">
        <InputGroupAddon addonType="prepend">Result</InputGroupAddon>
        <Input
          value={stateRid}
          name="rid"
          type="select"
          onChange={handleChange}
        >
          <option> --- </option>
          {items.map(item => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Input>
      </InputGroup>
    </div>
  );
};
