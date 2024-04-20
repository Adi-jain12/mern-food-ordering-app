import { Order, Restaurant } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCreateMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createMyRestaurant = async (
    restaurantFormData: FormData
  ): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: restaurantFormData,
    });

    if (!response.ok) {
      throw new Error("Error creating restaurant");
    }

    return response.json();
  };

  const {
    mutate: createRestaurant,
    error,
    isLoading,
    isSuccess,
  } = useMutation(createMyRestaurant);

  if (isSuccess) {
    toast.success("Restaurant created!");
  }

  if (error) {
    toast.error("Unable to update restaurant");
  }

  return {
    createRestaurant,
    isLoading,
  };
};

export const useGetMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyRestaurant = async (): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error getting restaurant details");
    }

    return response.json();
  };

  const {
    data: restaurantDetails,
    error,
    isLoading,
  } = useQuery("getMyRestaurant", getMyRestaurant);

  if (error) {
    toast.error("Error getting restaurant details");
  }

  return {
    restaurantDetails,
    isLoading,
  };
};

export const useUpdateMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateMyRestaurant = async (
    updateRestaurantFormData: FormData
  ): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: updateRestaurantFormData,
    });

    if (!response.ok) {
      throw new Error("Error updating restaurant");
    }

    return response.json();
  };

  const {
    mutate: updateRestaurant,
    error,
    isSuccess,
    isLoading,
  } = useMutation(updateMyRestaurant);

  if (isSuccess) {
    toast.success("Restaurant Updated");
  }

  if (error) {
    toast.error("Failed to update restaurant");
  }

  return { updateRestaurant, isLoading };
};

export const useMyRestarantOrders = () => {
  const { getAccessTokenSilently } = useAuth0();

  const myRestaurantOrders = async (): Promise<Order[]> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/restaurant/orders`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Orders not found");
    }

    return response.json();
  };

  const { data: restaurantOrders, isLoading } = useQuery(
    " myRestaurantOrders",
    myRestaurantOrders
  );
  return { restaurantOrders, isLoading };
};

type UpdateOrderStatusType = {
  orderId: string;
  status: string;
};

export const useUpdateOrderStatus = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateOrderStatus = async (
    updateOrderStatusRequest: UpdateOrderStatusType
  ) => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(
      `${API_BASE_URL}/api/my/restaurant/order/${updateOrderStatusRequest.orderId}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: updateOrderStatusRequest.status }),
      }
    );

    if (!response.ok) {
      throw new Error("Unable to update the order");
    }

    return response.json();
  };

  const {
    mutateAsync: updateRestaurantStatus,
    isLoading,
    isError,
    isSuccess,
    reset,
  } = useMutation(updateOrderStatus);

  if (isSuccess) {
    toast.success("Order updated successfully");
  }

  if (isError) {
    toast.error("Unable to update order");
    reset();
  }

  return {
    updateRestaurantStatus,
    isLoading,
  };
};
