import React, { useContext, useState, useEffect } from "react";
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
import _ from "lodash";
import { UserStory, Grade } from "./UserStory";
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
    const userStories = _.chain(tasks)
      .filter({ assigned_to: userInfo.id })
      .groupBy("user_story")
      .map((items, key) => ({
        user_story: Number(key),
        user_story_extra_info: items[0].user_story_extra_info,
        tasks: items,
        is_closed: items.every(task => task.is_closed)
      }))
      .value();
    setUserStories(userStories);
  }, [tasks, userInfo.id]);

  const customAttrE = getCustomAttr(custom_attrs, Number(custom_eid));
  const customAttrR = getCustomAttr(custom_attrs, Number(custom_rid));
  if (!customAttrE || !customAttrR || biz_days.length <= 1) {
    return null;
  }

  const [e, r] = items.reduce(
    (result, item) => {
      return [
        result[0] + getCustomVal(custom_value_map, item, customAttrE.id),
        result[1] + getCustomVal(custom_value_map, item, customAttrR.id)
      ];
    },
    [0, 0]
  );
  const valid = isCustomValValid(
    e,
    r,
    userStories.every(item => item.is_closed)
  );
  const invalid = isCustomValInvalid(e, r);
  const loading = items.some(
    item => !getCustomValVersion(custom_value_map, item)
  );

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
