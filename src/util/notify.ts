import { toastr } from "./toastr";
type CloseFn = (sec?: number) => void;
export type NotifyClickHandler = (close: CloseFn) => void;
interface NotifyArgs {
  title: string;
  body: string;
  option?: string;
  icon: string;
  onClick: NotifyClickHandler;
  onDblclick?: NotifyClickHandler;
}
export const notify = ({
  title,
  body,
  option = "",
  icon,
  onClick,
  onDblclick
}: NotifyArgs) => {
  let clickCount = 0;
  let closeTimer: NodeJS.Timeout | null = null;
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      body: `${body} ${option}`,
      icon
    });
    const closeFn = (sec = 0) => {
      if (sec) {
        closeTimer = setTimeout(() => {
          notification.close();
          closeTimer = null;
        }, sec * 1000);
      } else {
        notification.close();
      }
    };
    notification.onclick = () => {
      if (clickCount === 0) {
        clickCount++;
        onClick(closeFn);
      } else {
        closeTimer && clearTimeout(closeTimer);
        onDblclick && onDblclick(closeFn);
      }
    };
  } else {
    toastr.notify({ title, body, icon });
  }
};
