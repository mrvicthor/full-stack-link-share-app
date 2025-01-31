import { useNotification } from "@/hooks/useNotification";
import LinkIcon from "@/assets/images/icon-link-copied-to-clipboard.svg";

type NotificationProps = {
  message: string;
};

const Notification = ({ message }: NotificationProps) => {
  const { notification } = useNotification();

  if (!notification) return null;
  return (
    <div className="fixed bottom-[2rem] flex justify-center w-full z-50">
      <div
        className={`
         bg-[#333333] rounded-md p-4 text-white m-auto flex gap-2  w-[22rem]`}
      >
        <img src={LinkIcon} alt="link-copied-icon" />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Notification;
