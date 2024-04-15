import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import LoadingButton from "../LoadingButton";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import UserProfileForm, {
  UserFormData,
} from "@/forms/user-profile-form/UserProfileForm";
import { useFetchUserProfileDetails } from "@/api/MyUserApi";

type Props = {
  onCheckout: (userFormData: UserFormData) => void;
  disabled: boolean;
};

const CheckoutButton = ({ onCheckout, disabled }: Props) => {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    loginWithRedirect,
  } = useAuth0();

  const { pathname } = useLocation(); // for redirecting back to restaurant details page once the user logs in with Auth0 page

  const { userProfile, isLoading: isGetUserLoading } =
    useFetchUserProfileDetails();

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

  if (isAuthLoading || !userProfile) {
    return <LoadingButton />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="bg-orange-500 flex-1">
          Go to checkout
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[425px] md:min-w-[700px] bg-gray-50">
        <UserProfileForm
          currentUser={userProfile}
          isLoading={isGetUserLoading}
          onSave={onCheckout}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutButton;
