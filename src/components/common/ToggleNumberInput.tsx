import React, { useState, useCallback, useEffect } from "react";
import {
  Form,
  InputGroupAddon,
  InputGroup,
  InputGroupText,
  Button,
  Input
} from "reactstrap";
import { InputGroupSpinner } from "../InputGroupSpinner";
import { Switch } from "@rmwc/switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUploadAlt,
  faEdit,
  faHandPointRight
} from "@fortawesome/free-solid-svg-icons";
import styles from "./ToggleNumberInput.module.css";
interface ToggleNumberInputProps {
  label: string;
  value: number;
  onSubmit?: (value: number) => void;
  onEditable?: (value: boolean) => void;
  onValueChange?: (value: number) => void;
  valid?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  loading?: boolean;
  id?: string;
  submitting?: boolean;
  disabledMessage?: string;
}
export const ToggleNumberInput: React.FC<ToggleNumberInputProps> = ({
  label,
  value,
  onSubmit,
  onEditable,
  onValueChange,
  valid,
  invalid,
  disabled,
  loading,
  id,
  submitting,
  disabledMessage = ""
}) => {
  const [checked, setChecked] = useState(false);
  const [val, setVal] = useState("");
  const [running, setRunning] = useState(false);
  const onChange = useCallback(
    (evt: React.FormEvent<any>) => {
      setChecked(evt.currentTarget.checked);
    },
    [setChecked]
  );
  const handleVal = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setVal(value);
      onValueChange && onValueChange(Number(value));
    },
    [onValueChange]
  );
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      const num = Number(val);
      if (checked && val !== "" && num >= 0 && onSubmit) {
        onSubmit(num);
        setChecked(false);
        setRunning(true);
      }
      e.preventDefault();
    },
    [checked, val, onSubmit, setChecked]
  );
  useEffect(() => {
    if (disabled) {
      setChecked(false);
    }
  }, [setChecked, disabled]);
  useEffect(() => {
    setRunning(false);
  }, [value]);
  useEffect(() => {
    onEditable && onEditable(checked);
  }, [checked, onEditable]);
  useEffect(() => {
    if (submitting) {
      setChecked(false);
      setRunning(true);
    }
  }, [submitting]);
  useEffect(() => {
    if (loading) {
      setChecked(false);
    }
  }, [loading]);
  return (
    <Form inline onSubmit={handleSubmit}>
      <InputGroup className={styles.input_group}>
        <InputGroupAddon addonType="prepend">{label}</InputGroupAddon>
        {loading ? (
          <InputGroupSpinner />
        ) : (
          <>
            {checked ? (
              <>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>{value}</InputGroupText>
                </InputGroupAddon>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <FontAwesomeIcon
                      className="text-info"
                      icon={faHandPointRight}
                    />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  onInput={handleVal}
                  onChange={handleVal}
                  defaultValue={String(value)}
                  type="number"
                  step="0.5"
                  min="0"
                  id={id}
                />
                <InputGroupAddon addonType="append">
                  <Button color="info">
                    <FontAwesomeIcon icon={faCloudUploadAlt} />
                  </Button>
                </InputGroupAddon>
              </>
            ) : (
              <>
                {running ? (
                  <InputGroupSpinner />
                ) : (
                  <Input
                    valid={valid}
                    invalid={invalid}
                    readOnly
                    value={value}
                    className="text-right"
                  />
                )}
              </>
            )}
            <InputGroupAddon
              addonType="append"
              title={disabled ? disabledMessage : ""}
            >
              <Switch disabled={disabled} checked={checked} onChange={onChange}>
                <FontAwesomeIcon className="text-info" icon={faEdit} />
              </Switch>
            </InputGroupAddon>
          </>
        )}
      </InputGroup>
    </Form>
  );
};
