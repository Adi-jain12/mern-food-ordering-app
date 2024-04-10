import {
  useCreateMyRestaurant,
  useGetMyRestaurant,
  useUpdateMyRestaurant,
} from "@/api/MyRestaurantApi";
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm";

const ManageRestaurantPage = () => {
  const { createRestaurant, isLoading: loadingOfCreate } =
    useCreateMyRestaurant();
  const { restaurantDetails } = useGetMyRestaurant();
  const { updateRestaurant, isLoading: loadingOfUpdate } =
    useUpdateMyRestaurant();

  const isEditing = !!restaurantDetails; //when the component loads the very first time it will get and check if the restaurantDetails is available if yes then !!restaurantDetails will return true otherwise false. Here !! means truthy value

  return (
    <ManageRestaurantForm
      onSave={isEditing ? updateRestaurant : createRestaurant}
      isLoading={loadingOfCreate || loadingOfUpdate}
      restaurant={restaurantDetails}
    />
  );
};

export default ManageRestaurantPage;
