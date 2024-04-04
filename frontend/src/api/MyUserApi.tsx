import { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useFetchUserProfileDetails = () => {
  const { getAccessTokenSilently } = useAuth0();

  const fetchUserProfile = async (): Promise<User> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Unable to fetch user profile details");
    }

    return response.json();
  };

  const {
    data: userProfile,
    error,
    isLoading,
  } = useQuery("fetchUserProfile", fetchUserProfile);

  if (error) {
    toast.error(error.toString());
  }

  return {
    userProfile,
    isLoading,
  };
};

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

type UpdateUserForm = {
  name: string;
  addressLine1: string;
  city: string;
  country: string;
};

export const useUpdateUserProfile = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateUserProfile = async (formData: UpdateUserForm) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/user/update`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`, // this will send the accessToken in headers
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user profile");
    }

    return response.json();
  };

  const {
    mutateAsync: updateProfile,
    isLoading,
    isSuccess,
    error,
    reset,
  } = useMutation(updateUserProfile);

  if (isSuccess) {
    toast.success("User profile updated!");
  }

  if (error) {
    toast.error(error.toString());
    reset(); //it clears the error state from the request as we dont want the error toast to keep appearing anytime the component re renders
  }

  return { updateProfile, isLoading };
};
