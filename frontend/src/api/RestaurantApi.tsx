import { RestaurantSearchResponse } from "@/types";
import { useQuery } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useRestaurantSearch = (city?: string) => {
  const restaurantSearch = async (): Promise<RestaurantSearchResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/restaurant/search/${city}`
    );

    if (!response.ok) {
      throw new Error("Error getting restaurants");
    }

    return response.json();
  };

  const {
    data: restaurants,

    isLoading,
  } = useQuery("restaurantSearch", restaurantSearch, {
    enabled: !!city, // this means that run this query only if city is truthy value otherwise don't run
  });

  return {
    restaurants,
    isLoading,
  };
};
