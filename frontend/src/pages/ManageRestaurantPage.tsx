import {
  useCreateMyRestaurant,
  useGetMyRestaurant,
} from "@/api/MyRestaurantApi";
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm";

const ManageRestaurantPage = () => {
  const { createRestaurant, isLoading: loadingOfCreate } =
    useCreateMyRestaurant();
  const { restaurantDetails, isLoading } = useGetMyRestaurant();

  if (isLoading) {
    return <h2>Loading....</h2>;
  }

  return (
    <ManageRestaurantForm
      onSave={createRestaurant}
      isLoading={loadingOfCreate}
      restaurant={restaurantDetails}
    />
  );
};

export default ManageRestaurantPage;
