import { toast } from "react-toastify";

export const MyToast = (msg, type, transition) => {
  return toast(msg, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    type: type,
    transition: transition,
  });
};

export { toast };
