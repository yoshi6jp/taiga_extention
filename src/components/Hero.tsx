import React, { useContext, useMemo } from "react";
import { Card, CardHeader, CardBody, CardTitle, Col, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faBurn,
  faLevelDownAlt,
  faEllipsisH,
  faEllipsisV
} from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import classNames from "classnames";
import { Elevation } from "@rmwc/elevation";
import { AvatarSquare } from "./task/UserTasks";
// import CountUp from "react-countup";
import { RootContext } from "../Provider";
import { getTaskSumByUser } from "./task/UserTasks";
import { IUser, ITask } from "../store";
import moment from "moment";
import styles from "./Hero.module.css";
type TRanking = 1 | 2 | 3;
interface IHeroUser extends IUser {
  e: number;
  r: number;
  ranking?: TRanking;
}
const rank = (result: IHeroUser[], hero: IHeroUser) => {
  const prev = _.last(result);
  let ranking: TRanking;
  if (prev && prev.ranking) {
    ranking =
      prev.e === hero.e ? prev.ranking : ((prev.ranking + 1) as TRanking);
  } else {
    ranking = 1;
  }
  const rankedHero = { ...hero, ranking };
  return [...result, rankedHero];
};
const getTaskFinishedPrevious = (
  tasks: ITask[],
  date: string,
  biz_days: string[]
) => {
  const idx = biz_days.indexOf(date);
  if (idx < 1) {
    return [];
  } else {
    const beginM = moment(biz_days[idx - 1])
      .local()
      .startOf("day");
    const endM = moment(date)
      .local()
      .startOf("day");

    return tasks.filter(task => {
      const targetM = moment(task.finished_date);
      return targetM.diff(beginM) >= 0 && targetM.diff(endM) < 0;
    });
  }
};
interface HeroItemProps {
  name: string;
  src?: string;
  value: number;
  ranking: TRanking;
}
const HeroItem: React.FC<HeroItemProps> = ({ name, src, value, ranking }) => {
  return (
    <Col sm={4}>
      <Card>
        <CardHeader
          className={classNames(
            { [styles.gold]: ranking === 1 },
            { [styles.silver]: ranking === 2 },
            { [styles.bronze]: ranking === 3 }
          )}
        >
          <FontAwesomeIcon icon={faAward} /> Top {ranking}
        </CardHeader>
        <CardBody>
          <CardTitle>
            <h2 className="text-truncate" title={name}>
              <AvatarSquare src={src} size="xlarge" />
              {name}
            </h2>
          </CardTitle>
          <Row>
            <Col className="my-auto text-danger text-right">
              <h4>
                <FontAwesomeIcon icon={faLevelDownAlt} />
                <FontAwesomeIcon icon={faBurn} />
              </h4>
            </Col>
            <Col>
              <Elevation z={6}>
                <h1 className="text-center">
                  {/* <CountUp start={0} delay={3} duration={value} end={value} /> */}
                </h1>
              </Elevation>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};
export const Hero: React.FC = () => {
  const {
    state: {
      project: { members },
      tasks,
      custom_value_map,
      custom_eid,
      custom_rid,
      biz_days
    }
  } = useContext(RootContext);
  const today = moment().format("YYYY-MM-DD");
  const finishedTasks = useMemo(
    () => getTaskFinishedPrevious(tasks, today, biz_days),
    [biz_days, tasks, today]
  );

  const sumByUser = useMemo(
    () =>
      getTaskSumByUser(finishedTasks, custom_value_map, custom_eid, custom_rid),
    [custom_eid, custom_rid, custom_value_map, finishedTasks]
  );

  const heros = useMemo(
    () =>
      _.chain(members)
        .map(
          member =>
            [member, sumByUser[member.id] || { e: 0, r: 0 }] as [
              IUser,
              { e: number; r: number }
            ]
        )
        .map(([member, { e, r }]) => ({ ...member, e, r }))
        .sortBy(item => item.e + item.r / 100)
        .reverse()
        .filter(item => item.e > 0)
        .take(3)
        .reduce(rank, [])
        .value() as Required<IHeroUser>[],
    [members, sumByUser]
  );

  const idx = biz_days.indexOf(today) - 1;

  if (idx < 1 || heros.length === 0) {
    return null;
  } else {
    return (
      <Card>
        <CardHeader>Day {idx} Hero</CardHeader>
        <CardBody>
          <Row>
            {heros.map(hero => (
              <HeroItem
                key={hero.id}
                name={hero.username}
                value={hero.e}
                src={hero.photo}
                ranking={hero.ranking}
              />
            ))}
            {_.times(3 - heros.length).map(i => (
              <Col key={i}>
                <Card>
                  <CardHeader>
                    <FontAwesomeIcon icon={faEllipsisH} />
                  </CardHeader>
                  <CardBody className="text-center">
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>
    );
  }
};
