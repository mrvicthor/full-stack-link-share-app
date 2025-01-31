import { createContext } from "react";

type NotificationContextType = {
  notification: boolean;
  setNotification: (value: boolean) => void;
};

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);
