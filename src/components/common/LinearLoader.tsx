import React from "react";
import { LinearProgress } from "@rmwc/linear-progress";
export const LinearLoader: React.SFC = () => (
  <LinearProgress
    progress={0}
    buffer={0}
    className="my-auto mx-2 border-0 form-control"
  />
);
