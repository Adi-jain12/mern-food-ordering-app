import { SearchState } from "@/pages/SearchPage";
import { Restaurant, RestaurantSearchResponse } from "@/types";
import { useQuery } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetRestaurantDetails = (restaurantId?: string) => {
  const getRestaurantDetails = async (): Promise<Restaurant> => {
    const response = await fetch(
      `${API_BASE_URL}/api/restaurant/${restaurantId}`
    );

    if (!response.ok) {
      throw new Error("Error getting restaurant");
    }

    return response.json();
  };

  const { data: restaurantDetails, isLoading } = useQuery(
    "getRestaurantDetails",
    getRestaurantDetails
  );

  return {
    restaurantDetails,
    isLoading,
  };
};

export const useRestaurantSearch = (
  searchState: SearchState,
  city?: string
) => {
  const restaurantSearch = async (): Promise<RestaurantSearchResponse> => {
    // this is to add some key value pairs which will converted to query parameters so that we can add it to the fetch url
    const params = new URLSearchParams();
    params.set("searchQuery", searchState.searchQuery);
    params.set("page", searchState.page.toString());
    params.set("selectedCuisines", searchState.selectedCuisines.join(","));
    params.set("sortOption", searchState.sortOption.toString());

    const response = await fetch(
      `${API_BASE_URL}/api/restaurant/search/${city}?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Error getting restaurants");
    }

    return response.json();
  };

  const { data: restaurants, isLoading } = useQuery(
    ["restaurantSearch", searchState], // adding searchState in this array because we are telling useQuery hook to run again whenever the searchState has changed. Eg : So whenever the user types in search bar the state will change and it will passed to useRestaurantSearch and in this array too so that useQuery will call the restaurantSearch url again which will give us the new results.
    restaurantSearch,
    {
      enabled: !!city, // this means that run this query only if city is truthy value otherwise don't run
    }
  );

  return {
    restaurants,
    isLoading,
  };
};
