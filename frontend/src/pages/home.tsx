import Loading from "@/components/Loading";
import useAuth from "@/hooks/useAuth";

import { Navigate, Outlet } from "react-router-dom";
const Home = (): JSX.Element => {
  const { isLoading, error, isAuthenticated } = useAuth();

  return isLoading ? (
    <Loading />
  ) : error || !isAuthenticated ? (
    <Navigate to="/login" />
  ) : (
    <section>
      <Outlet />
    </section>
  );
};

export default Home;
