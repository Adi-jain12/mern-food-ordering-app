import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;

  // Note : We are doing the above logic by seprating the below logic with conditions because as we refresh the page it navigates to home page i.e "/".
  // Why we are doing the above logic? => because the way JS works asynchronously so when this page loads the very first time the useAuth hook will run asynchronouly behind the scene, while it is running behind for a while, the below line will get excuted immediately which will have isAuthenticated as false and if false then it will Navigate to "/". So to overcome this issue we are doing the above logic.

  //Outlet means render all the child routes of this component
  // return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />; //replace in Navigate means that we want this to be a new URL
};

export default ProtectedRoute;
