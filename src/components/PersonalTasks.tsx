import React, { useContext, useState, useEffect, useMemo } from "react";
import { RootContext } from "../Provider";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  InputGroup,
  InputGroupAddon,
  Row,
  Col
} from "reactstrap";
import classNames from "classnames";
import { ITask, IUser, ITasksByUserStory } from "../store";
import { InputGroupSpinner } from "./InputGroupSpinner";
import {
  getCustomAttr,
  getCustomVal,
  getCustomValVersion,
  isCustomValInvalid,
  isCustomValValid,
  TaskProgress
} from "./UserTasks";
import { UserStory, Grade, convToTasksByUserStory } from "./UserStory";
export const PersonalTasks = ({ userInfo }: { userInfo: IUser }) => {
  const {
    state: {
      tasks,
      custom_attrs,
      custom_value_map,
      custom_eid,
      custom_rid,
      biz_days
    }
  } = useContext(RootContext);
  const [items, setItems] = useState<ITask[]>([]);
  const [userStories, setUserStories] = useState<ITasksByUserStory[]>([]);
  useEffect(() => {
    const userTasks = tasks
      .filter(task => task.assigned_to === userInfo.id)
      .sort((a, b) => a.user_story - b.user_story);
    setItems(userTasks);
    const userStories = convToTasksByUserStory(userTasks);
    setUserStories(userStories);
  }, [tasks, userInfo.id]);

  const customAttrE = useMemo(
    () => getCustomAttr(custom_attrs, Number(custom_eid)),
    [custom_attrs, custom_eid]
  );
  const customAttrR = useMemo(
    () => getCustomAttr(custom_attrs, Number(custom_rid)),
    [custom_attrs, custom_rid]
  );
  const [e, r] = useMemo(
    () =>
      items.reduce(
        (result, item) => {
          return [
            result[0] +
              (customAttrE
                ? getCustomVal(custom_value_map, item, customAttrE.id)
                : 0),
            result[1] +
              (customAttrR
                ? getCustomVal(custom_value_map, item, customAttrR.id)
                : 0)
          ];
        },
        [0, 0]
      ),
    [customAttrE, customAttrR, custom_value_map, items]
  );
  const valid = useMemo(
    () => isCustomValValid(e, r, userStories.every(item => item.is_closed)),
    [e, r, userStories]
  );
  const invalid = useMemo(() => isCustomValInvalid(e, r), [e, r]);
  const loading = useMemo(
    () => items.some(item => !getCustomValVersion(custom_value_map, item)),
    [custom_value_map, items]
  );
  if (!customAttrE || !customAttrR || biz_days.length <= 1) {
    return null;
  }

  return (
    <>
      {userStories.map(item => (
        <UserStory item={item} key={item.user_story} />
      ))}
      <Card>
        <CardHeader className={classNames("bg-info", "text-light")}>
          Total
        </CardHeader>
        <CardBody>
          <Row>
            <Col>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  {customAttrE.name}
                </InputGroupAddon>
                {loading ? <InputGroupSpinner /> : <Input readOnly value={e} />}
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  {customAttrR.name}
                </InputGroupAddon>
                {loading ? (
                  <InputGroupSpinner />
                ) : (
                  <Input readOnly value={r} invalid={invalid} valid={valid} />
                )}
              </InputGroup>
            </Col>
            <Col>
              <Grade e={e} r={r} />
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          <TaskProgress tasks={items} />
        </CardFooter>
      </Card>
    </>
  );
};
