import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth0();

  //Outlet means render all the child routes of this component
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />; //replace in Navigate means that we want this to be a new URL
};

export default ProtectedRoute;
