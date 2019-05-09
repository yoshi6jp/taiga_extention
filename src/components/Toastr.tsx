import React, { useRef } from "react";
import { ToastContainer, ToastMessageAnimated } from "react-toastr";
const toastMessageFactory = React.createFactory(ToastMessageAnimated);
export const Toastr: React.FC = () => {
  const ref = useRef<ToastContainer>(null);
  return <ToastContainer ref={ref} toastMessageFactory={toastMessageFactory} />;
};
