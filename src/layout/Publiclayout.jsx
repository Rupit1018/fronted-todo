import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";

const PublicRoute = () => {
  const { loading, authUser } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (authUser) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PublicRoute;
