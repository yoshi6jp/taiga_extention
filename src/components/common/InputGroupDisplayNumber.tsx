import React from "react";
import { InputGroup, InputGroupAddon, Input } from "reactstrap";
import { InputGroupSpinner } from "../InputGroupSpinner";
interface OwnProp {
  label: string;
  value: number;
  loading?: boolean;
  size?: string;
  invalid?: boolean;
  valid?: boolean;
}
export const InputGroupDisplayNumber: React.FC<OwnProp> = ({
  label,
  value,
  loading,
  size,
  invalid,
  valid
}) => {
  return (
    <InputGroup size={size} className="my-n1">
      <InputGroupAddon addonType="prepend">{label}</InputGroupAddon>
      {loading ? (
        <InputGroupSpinner />
      ) : (
        <Input
          invalid={invalid}
          valid={valid}
          readOnly
          value={value}
          className="text-right"
        />
      )}
    </InputGroup>
  );
};
