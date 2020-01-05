import React, { useCallback } from "react";
import { UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLevelDownAlt,
  faLevelUpAlt,
} from "@fortawesome/free-solid-svg-icons";
export type ChartType = "Burn up" | "Burn down"
interface ChartTypeItemProps {
  type: ChartType;
}

const ChartTypeItem: React.FC<ChartTypeItemProps> = ({ type }) => {
  const icon = type === "Burn down" ? faLevelDownAlt : faLevelUpAlt;
  return (
    <span>
      {type}
      <FontAwesomeIcon className="fa-fw" icon={icon} />
    </span>
  );
};
interface ChartTypeDropdownItemProps extends ChartTypeItemProps {
  onSelect: (type: ChartType) => void;
}
const ChartTypeDropdownItem: React.FC<ChartTypeDropdownItemProps> = ({
  type,
  onSelect
}) => {
  const handleClick = useCallback(() => {
    onSelect(type);
  }, [onSelect, type]);
  return (
    <DropdownItem onClick={handleClick}>
      <ChartTypeItem type={type} />
    </DropdownItem>
  );
};

export const ChartTypeSelector: React.FC<ChartTypeDropdownItemProps> = ({ type, onSelect }) => {
  return (
    <UncontrolledButtonDropdown>
      <DropdownToggle size="sm" caret>
        <ChartTypeItem type={type} />
      </DropdownToggle>
      <DropdownMenu>
        <ChartTypeDropdownItem type="Burn up" onSelect={onSelect} />
        <ChartTypeDropdownItem type="Burn down" onSelect={onSelect} />
      </DropdownMenu>
    </UncontrolledButtonDropdown>
  )
}