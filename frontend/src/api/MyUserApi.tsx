import { useMutation } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type CreateUserRequest = {
  auth0Id: string;
  email: string;
};

export const useCreateMyUser = () => {
  const createMyUserRequest = async (user: CreateUserRequest) => {
    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "POST",
      headers: {
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
