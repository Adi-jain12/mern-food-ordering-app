import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import LoadingButton from "../LoadingButton";

const CheckoutButton = () => {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    loginWithRedirect,
  } = useAuth0();

  const { pathname } = useLocation(); // for redirecting back to restaurant details page once the user logs in with Auth0 page

  const onLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: pathname, //used to store the pathname and return to it once the login process completes
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <Button onClick={onLogin} className="bg-orange-500 flex-1">
        Log in to check out
      </Button>
    );
  }

  if (isAuthLoading) {
    return <LoadingButton />;
  }
};

export default CheckoutButton;
