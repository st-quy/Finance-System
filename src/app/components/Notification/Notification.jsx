import { notification } from "antd";

export const Toast = (type, message, description) => {
  notification[type]({
    message: message,
    description: description,
    placement: "top",
    duration: 1,
  });

  notification.config({
    maxCount: 1,
  });
};
