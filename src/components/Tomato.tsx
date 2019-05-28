import React from "react";
import { ReactComponent as TomatoIcon } from "../tomato.svg";
import classNames from "classnames";
import styles from "./Tomato.module.css";
export enum TomatoState {
  FRESH = "fresh",
  STALE = "stale"
}
interface TomatoProps {
  state?: TomatoState;
}
export const Tomato: React.FC<TomatoProps> = ({ state }) => {
  return (
    <TomatoIcon
      className={classNames("fa-fw", "svg-inline--fa", {
        [styles.fresh]: state === TomatoState.FRESH,
        [styles.stale]: state === TomatoState.STALE
      })}
    />
  );
};
