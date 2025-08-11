import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";
import Header from "./Header";

const PrivateLayout = () => {
  const { authUser, loading } = useAuth(); 
console.log("PrivateLayout: authUser =", authUser);
  if (loading) {
    return <Loader />;
  }

  if (!authUser) {
    

    return <Navigate to="/login" />; 
  }

  return (<>
  <Header /><Outlet /> 
  </>);
};

export default PrivateLayout;
