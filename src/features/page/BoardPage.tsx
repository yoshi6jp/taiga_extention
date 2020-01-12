import React, { useContext, useState, useCallback, useMemo } from "react";
import _ from "lodash";
import { RootContext } from "../../Provider";
import { Col, Row, Card, CardHeader, CardBody, Breadcrumb, BreadcrumbItem } from "reactstrap";
import { getTasksByUser, getSumCustomValClosed } from "../task/util"
import { ITask } from "../task/taskSlice";
import { IUser } from '../user/userSlice'
import { Link } from "react-router-dom";
import { AvatarSquare } from "../user/AvatarSquare";
import { BurnUpChart, BurnDownChart } from "../chart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faChalkboard } from "@fortawesome/free-solid-svg-icons";
import { UpdateButton } from "../common";
import { ChartType, ChartTypeSelector } from "../chart/ChartTypeSelector";
interface BoardItemProps {
  user: IUser;
  tasks: ITask[];
  type: ChartType;
}
const BoardItem: React.FC<BoardItemProps> = ({ user, tasks, type }) => {
  return (
    <Col sm="12" md="6" lg="4" >
      <Card>
        <CardHeader className="text-truncate" title={user.username}>
          <AvatarSquare src={user.photo} />
          <Link to={`/users/${user.id}`}>
            {user.username}
          </Link>
        </CardHeader>
        <CardBody>
          {type === "Burn down" ?
            <BurnDownChart tasks={tasks} size="sm" />
            :
            <BurnUpChart tasks={tasks} size="sm" />
          }
        </CardBody>
      </Card>
    </Col>)
}
export const BoardPage: React.FC = () => {
  const { state: { tasks, project: { members }, custom_value_map, custom_eid } } = useContext(RootContext)
  const [chartType, setChartType] = useState<ChartType>("Burn up")
  const tasksByUid = useMemo(() => getTasksByUser(tasks), [tasks])
  const sortedTasks = useMemo(() => _.chain(members)
    .filter(user => _.has(tasksByUid, user.id))
    .map(user => ({ user, tasks: tasksByUid[user.id], closed: getSumCustomValClosed(custom_value_map, tasksByUid[user.id], Number(custom_eid)) }))
    .sortBy("closed")
    .value(), [tasksByUid, members, custom_value_map, custom_eid])
  const handleSelect = useCallback((type: ChartType) => {
    setChartType(type);
  }, [setChartType]);
  return (
    <>
      <Breadcrumb tag="nav" >
        <BreadcrumbItem title="Home" tag={Link} to={"/"}><FontAwesomeIcon icon={faHome} /></BreadcrumbItem>
        <BreadcrumbItem className="mr-auto" tag="span" active><FontAwesomeIcon icon={faChalkboard} />  Board</BreadcrumbItem>
        <ChartTypeSelector type={chartType} onSelect={handleSelect} />
        <UpdateButton size="sm" />
      </Breadcrumb>
      <Row className="mt-1">
        {sortedTasks.map(({ user, tasks }, i) => (
          <BoardItem key={i} user={user} tasks={tasks} type={chartType} />
        ))}
      </Row>
    </>
  )

}
