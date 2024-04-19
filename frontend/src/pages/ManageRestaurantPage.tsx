import {
  useCreateMyRestaurant,
  useGetMyRestaurant,
  useMyRestarantOrders,
  useUpdateMyRestaurant,
} from "@/api/MyRestaurantApi";
import OrderItemCard from "@/components/OrderItemCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm";

const ManageRestaurantPage = () => {
  const { createRestaurant, isLoading: loadingOfCreate } =
    useCreateMyRestaurant();
  const { restaurantDetails } = useGetMyRestaurant();
  const { updateRestaurant, isLoading: loadingOfUpdate } =
    useUpdateMyRestaurant();

  const { restaurantOrders } = useMyRestarantOrders();

  const isEditing = !!restaurantDetails; //when the component loads the very first time it will get and check if the restaurantDetails is available if yes then !!restaurantDetails will return true otherwise false. Here !! means truthy value

  return (
    <Tabs defaultValue="orders">
      <TabsList>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="manage-restaurant">Manage Restaurant</TabsTrigger>
      </TabsList>

      <TabsContent
        value="orders"
        className="space-y-5 bg-gray-50 pg-10 rounded-lg"
      >
        <h2 className="text-2xl font-bold">
          {restaurantOrders?.length === 0 ? 0 : restaurantOrders?.length} active
          orders
        </h2>

        {restaurantOrders?.map((order) => (
          <OrderItemCard order={order} />
        ))}
      </TabsContent>
      <TabsContent value="manage-restaurant">
        <ManageRestaurantForm
          onSave={isEditing ? updateRestaurant : createRestaurant}
          isLoading={loadingOfCreate || loadingOfUpdate}
          restaurant={restaurantDetails}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ManageRestaurantPage;
