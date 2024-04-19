import { useMyOrderDetails } from "@/api/OrderAPI";

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
          <OrderStatusHeader order={orderDetails} />
        </div>
      ))}
    </div>
  );
};

export default OrderStatusPage;
