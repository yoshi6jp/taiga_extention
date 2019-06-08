import React from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faCheck,
  faCheckCircle,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
interface MessageWithIconProps {
  icon: IconProp;
  message: string;
}
const MessageWithIcon: React.FC<MessageWithIconProps> = ({ icon, message }) => {
  return (
    <div className="d-flex">
      <h2 className="mr-2">
        <FontAwesomeIcon icon={icon} />
      </h2>
      <div>{message}</div>
    </div>
  );
};
interface NotifyProps {
  title: string;
  body: string;
  icon: string;
}
const Notify: React.FC<NotifyProps> = ({ title, body, icon }) => {
  return (
    <div className="d-flex">
      <img src={icon} style={{ width: "48px", height: "48px" }} alt="" />
      <div className="ml-2">
        <h5>{title}</h5>
        <p>{body}</p>
      </div>
    </div>
  );
};
export const toastr = {
  info: (message: string) => {
    toast.info(<MessageWithIcon icon={faInfoCircle} message={message} />);
  },
  success: (message: string) => {
    toast.success(<MessageWithIcon icon={faCheck} message={message} />);
  },
  warn: (message: string) => {
    toast.warn(
      <MessageWithIcon icon={faExclamationTriangle} message={message} />
    );
  },
  error: (message: string) => {
    toast.error(<MessageWithIcon icon={faCheckCircle} message={message} />);
  },
  notify: ({ title, body, icon }: NotifyProps) => {
    toast(<Notify title={title} body={body} icon={icon} />);
  }
};
