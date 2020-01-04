import React from "react";
import { Avatar, AvatarProps } from "@rmwc/avatar";
export const AvatarSquare: React.FC<AvatarProps> = props => {
  const src = props.src || `http://i.pravatar.cc/80?u=${Math.random()}`;
  return <Avatar {...props} src={src} square className="mr-1" />;
};