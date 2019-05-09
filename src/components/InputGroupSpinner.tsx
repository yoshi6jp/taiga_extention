import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { InputGroupAddon, InputGroupText } from "reactstrap";
export const InputGroupSpinner: React.FC = () => {
  return (
    <InputGroupAddon addonType="append">
      <InputGroupText>
        <FontAwesomeIcon icon={faSpinner} className="fa-pulse" />
      </InputGroupText>
    </InputGroupAddon>
  );
};
