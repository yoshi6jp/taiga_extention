import React, { useContext, useMemo } from "react";
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
import { InputGroupSpinner } from "./InputGroupSpinner";
import {
  getCustomVal,
  getCustomValVersion,
  isCustomValInvalid,
  isCustomValValid,
  TaskProgress
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
  const [e, r] = useMemo(
    () =>
      user_tasks.reduce(
        (result, item) => {
          return [
            result[0] + getCustomVal(custom_value_map, item, custom_attr_e.id),
            result[1] + getCustomVal(custom_value_map, item, custom_attr_r.id)
          ];
        },
        [0, 0]
      ),
    [custom_attr_e.id, custom_attr_r.id, custom_value_map, user_tasks]
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
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  {custom_attr_e.name}
                </InputGroupAddon>
                {loading ? <InputGroupSpinner /> : <Input readOnly value={e} />}
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  {custom_attr_r.name}
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
          <TaskProgress tasks={user_tasks} />
        </CardFooter>
      </Card>
    </>
  );
};
