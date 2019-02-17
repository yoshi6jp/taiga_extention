import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Button } from "reactstrap";
import { PersonalTasks } from "./PersonalTasks";

interface OwnProps extends RouteComponentProps {}

export const PersonalPage = (props: OwnProps) => {
  const goBack = () => {
    props.history.goBack();
  };
  return (
    <>
      <Button onClick={goBack}>Go back</Button>
      <PersonalTasks />
    </>
  );
};
