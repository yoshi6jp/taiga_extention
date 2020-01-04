import React, { useContext } from "react";
import _ from "lodash";
import { RootContext } from "../../Provider";
import { Col, Row, Card, CardHeader, CardBody, Breadcrumb, BreadcrumbItem } from "reactstrap";
import { getTasksByUser, getSumCustomValClosed } from "../task/util"
import { ITask } from "../task/taskSlice";
import { IUser } from '../user/userSlice'
import { Link } from "react-router-dom";
import { AvatarSquare } from "../user/AvatarSquare";
import { BurnUpChart } from "../chart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faChalkboard } from "@fortawesome/free-solid-svg-icons";
import { UpdateButton } from "../common";
interface BoardItemProps {
  user: IUser;
  tasks: ITask[]
}
const BoardItem: React.FC<BoardItemProps> = ({ user, tasks }) => {
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
          <BurnUpChart tasks={tasks} size="sm" />
        </CardBody>
      </Card>
    </Col>)
}
export const BoardPage: React.FC = () => {
  const { state: { tasks, project: { members }, custom_value_map, custom_eid } } = useContext(RootContext)
  const tasksByUid = getTasksByUser(tasks)
  const sortedTasks = _.chain(members)
    .filter(user => _.has(tasksByUid, user.id))
    .map(user => ({ user, tasks: tasksByUid[user.id], closed: getSumCustomValClosed(custom_value_map, tasksByUid[user.id], Number(custom_eid)) }))
    .sortBy("closed")
    .value()
  return (
    <>
      <Breadcrumb tag="nav" >
        <BreadcrumbItem title="Home" tag={Link} to={"/"}><FontAwesomeIcon icon={faHome} /></BreadcrumbItem>
        <BreadcrumbItem className="mr-auto" tag="span" active><FontAwesomeIcon icon={faChalkboard} />  Board</BreadcrumbItem>
        <UpdateButton size="sm" />
      </Breadcrumb>
      <Row className="mt-1">
        {sortedTasks.map(({ user, tasks }, i) => (
          <BoardItem key={i} user={user} tasks={tasks} />
        ))}
      </Row>
    </>
  )

}
