import Loading from "@/components/ui/loading";
import useAuth from "@/hooks/useAuth";

import { Navigate } from "react-router-dom";
const Home = (): JSX.Element => {
  const { isLoading, user, error, isAuthenticated } = useAuth();

  console.log({ isLoading, user, error });
  if (isLoading) return <Loading />;

  if (error || !isAuthenticated) return <Navigate to="/login" />;

  return <div>Welcome, {user?.data.user.firstName}</div>;
};

export default Home;
