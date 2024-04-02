import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type CreateUserRequest = {
  auth0Id: string;
  email: string;
};

export const useCreateMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createMyUserRequest = async (user: CreateUserRequest) => {
    const accessToken = await getAccessTokenSilently(); // this will get the access token from useAuth0 provided func i.e getAccessTokenSilently
    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`, // this will send the accessToken in headers
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }
  };

  const {
    mutateAsync: createUser, //renaming the mutateAsync function to custom name for easy understanding and use
    isLoading,
    isError,
    isSuccess,
  } = useMutation(createMyUserRequest); //react query provides us isLoading , isError etc... from passing our fetch req to useMutation

  return {
    createUser,
    isLoading,
    isError,
    isSuccess,
  };
};
