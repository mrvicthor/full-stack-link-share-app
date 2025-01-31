import React, { useEffect, useState } from "react";
import { NotificationContext } from ".";

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notification, setNotification] = useState<boolean>(false);

  useEffect(() => {
    navigator.clipboard
      .writeText(window.location.href)
      .catch((err) => console.log("Failed to copy URL: ", err));
    const timeout = setTimeout(() => setNotification(false), 3000);
    return () => clearTimeout(timeout);
  }, [notification]);

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
