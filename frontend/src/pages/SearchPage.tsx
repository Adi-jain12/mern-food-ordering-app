import { useRestaurantSearch } from "@/api/RestaurantApi";
import PaginationSelector from "@/components/PaginationSelector";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import SearchResultCard from "@/components/SearchPage/SearchResultCard";
import SearchResultInfo from "@/components/SearchPage/SearchResultInfo";
import { useState } from "react";
import { useParams } from "react-router-dom";

export type SearchState = {
  searchQuery: string;
  page: number;
};

const SearchPage = () => {
  const { city } = useParams();
  const [searchState, setSearchState] = useState<SearchState>({
    searchQuery: "",
    page: 1,
  });
  const { restaurants, isLoading } = useRestaurantSearch(searchState, city);

  const handleSearchQuery = (searchFormData: SearchForm) => {
    setSearchState((prevState) => ({
      ...prevState, //this is because we dont want to update the other values like cuisines and sort filters
      searchQuery: searchFormData.searchQuery,
      page: 1, // this is because if user searches on page 4 so it should show the results from page 1
    }));
  };

  const handleResetSearch = () => {
    setSearchState((prevState) => ({
      ...prevState,
      searchQuery: "",
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setSearchState((prevState) => ({
      ...prevState,
      page: page,
    }));
  };

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
        <SearchBar
          searchQuery={searchState.searchQuery} // the reason we passed this is because we want to persist every typed value so that it doesnt get lost between re-renders
          onSubmit={handleSearchQuery}
          placeHolder="Search by Cuisine or Restaurant"
          onReset={handleResetSearch}
        />
        <SearchResultInfo total={restaurants.pagination.total} city={city} />
        {restaurants.data.map((restaurant) => (
          <SearchResultCard restaurant={restaurant} />
        ))}

        <PaginationSelector
          page={restaurants.pagination.page}
          pages={restaurants.pagination.pages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default SearchPage;
