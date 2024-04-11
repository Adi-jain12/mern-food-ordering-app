import { useRestaurantSearch } from "@/api/RestaurantApi";
import SearchResultCard from "@/components/SearchPage/SearchResultCard";
import SearchResultInfo from "@/components/SearchPage/SearchResultInfo";
import { useParams } from "react-router-dom";

const SearchPage = () => {
  const { city } = useParams();
  const { restaurants, isLoading } = useRestaurantSearch(city);

  if (isLoading) {
    <span>Loading...</span>;
  }

  //Handling the edge cases as on first time load this will return
  if (!restaurants?.data || !city) {
    return <span>No results found</span>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div id="cuisines-list">Cuisines List 😋</div>

      <div id="main-content" className="flex flex-col gap-5">
        <SearchResultInfo total={restaurants.pagination.total} city={city} />
        {restaurants.data.map((restaurant) => (
          <SearchResultCard restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
