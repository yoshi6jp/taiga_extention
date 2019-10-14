import React, { useContext, useMemo } from "react";
import { RootContext } from "../Provider";
import { InputGroupDisplayNumber } from "./common/InputGroupDisplayNumber";
import { Card, CardHeader, CardBody, CardFooter, Row, Col } from "reactstrap";
import classNames from "classnames";
import {
  getCustomValVersion,
  isCustomValInvalid,
  isCustomValValid,
  TaskProgress,
  getSumCustomVal
} from "./UserTasks";
import { UserStory, Grade, convToTasksByUserStory } from "./UserStory";

export const PersonalTasks: React.FC = () => {
  const {
    state: {
      custom_value_map,
      biz_days,
      user_tasks,
      custom_attr_e,
      custom_attr_r
    }
  } = useContext(RootContext);
  const userStories = useMemo(() => convToTasksByUserStory(user_tasks), [
    user_tasks
  ]);
  const e = useMemo(
    () => getSumCustomVal(custom_value_map, user_tasks, custom_attr_e.id),
    [custom_attr_e.id, custom_value_map, user_tasks]
  );
  const r = useMemo(
    () => getSumCustomVal(custom_value_map, user_tasks, custom_attr_r.id),
    [custom_attr_r.id, custom_value_map, user_tasks]
  );
  const valid = useMemo(
    () => isCustomValValid(e, r, userStories.every(item => item.is_closed)),
    [e, r, userStories]
  );
  const invalid = useMemo(() => isCustomValInvalid(e, r), [e, r]);
  const loading = useMemo(
    () => user_tasks.some(item => !getCustomValVersion(custom_value_map, item)),
    [custom_value_map, user_tasks]
  );
  if (!custom_attr_e.id || !custom_attr_r.id || biz_days.length <= 1) {
    return null;
  }

  return (
    <>
      {userStories.map(item => (
        <UserStory item={item} key={item.user_story} />
      ))}
      <Card>
        <CardHeader className={classNames("alert-info")}>Total</CardHeader>
        <CardBody>
          <Row>
            <Col>
              <InputGroupDisplayNumber
                label={custom_attr_e.name}
                value={e}
                loading={loading}
              />
            </Col>
            <Col>
              <InputGroupDisplayNumber
                label={custom_attr_r.name}
                value={r}
                invalid={invalid}
                valid={valid}
                loading={loading}
              />
            </Col>
            <Col>
              <Grade e={e} r={r} />
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          <TaskProgress tasks={user_tasks} />
        </CardFooter>
      </Card>
    </>
  );
};
