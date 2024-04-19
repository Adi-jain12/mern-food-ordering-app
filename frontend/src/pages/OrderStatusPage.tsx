import { useMyOrderDetails } from "@/api/OrderAPI";
import OrderStatusDetail from "@/components/OrderStatusPage/OrderStatusDetail";
import OrderStatusHeader from "@/components/OrderStatusPage/OrderStatusHeader";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const OrderStatusPage = () => {
  const { orderDetails, isLoading } = useMyOrderDetails();

  if (isLoading) {
    return "Loading...";
  }

  if (!orderDetails || orderDetails.length === 0) {
    return "No orders found";
  }

  return (
    <div className="space-y-10">
      {orderDetails.map((order) => (
        <div className="space-y-10 bg-gray-50 p-10 rounded-lg">
          <OrderStatusHeader order={order} />
          <div className="grid gap-10 md:grid-cols-2">
            <OrderStatusDetail order={order} />
            <AspectRatio ratio={16 / 5}>
              <img
                src={order.restaurant.imageUrl}
                className="rounded-md object-cover h-full w-full"
              />
            </AspectRatio>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStatusPage;
