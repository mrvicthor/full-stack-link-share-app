import { useParams } from "react-router-dom";
import CardInfo from "@/components/CardInfo";
import PreviewHeader from "@/components/PreviewHeader";
import Notification from "@/components/Notification";
import { NotificationProvider } from "@/context/NotificationContext";
import useDetails from "@/hooks/useDetails";
import useAuth from "@/hooks/useAuth";
import Loading from "@/components/Loading";

const Preview = () => {
  const { id } = useParams();
  const { user: authorizedUser } = useAuth();
  const { user, isLoading } = useDetails(id as string);

  console.log(user, id);
  return (
    <NotificationProvider>
      <section className="relative">
        <div className="md:bg-[#633cff] px-6 pt-6 h-[22.3125rem] md:rounded-b-3xl">
          {authorizedUser ? <PreviewHeader /> : null}
        </div>
        {isLoading ? <Loading /> : <CardInfo user={user} />}
        <Notification message="The link has been copied to your clipboard!" />
      </section>
    </NotificationProvider>
  );
};

export default Preview;
