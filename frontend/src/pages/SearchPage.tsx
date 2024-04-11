import { useRestaurantSearch } from "@/api/RestaurantApi";
import { useParams } from "react-router-dom";

const SearchPage = () => {
  const { city } = useParams();
  const { restaurants } = useRestaurantSearch(city);

  return (
    <span>
      User searched for {city}
      <span>
        {restaurants?.data.map((restaurant) => (
          <span>
            found - {restaurant.restaurantName}, {restaurant.city}
          </span>
        ))}
      </span>
    </span>
  );
};

export default SearchPage;
