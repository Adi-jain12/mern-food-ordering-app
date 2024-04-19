import { Order } from "@/types";
import { Progress } from "../ui/progress";

type Props = {
  order: Order;
};

const OrderStatusHeader = ({ order }: Props) => {
  const getExpectedDelivery = () => {
    const created = new Date(order.createdAt);

    created.setMinutes(
      created.getMinutes() + order.restaurant.estimatedDeliveryTime
    );

    const hours = created.getHours();
    const minutes = created.getMinutes();

    // hours = 12
    // minutes = 04
    // 12:04
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${paddedMinutes}`; // 12:04
  };

  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight flex flex-col gap-5 md:flex-row md:justify-between">
        <span>Order Status : {order.status}</span>
        <span>Expected by : {getExpectedDelivery()}</span>
      </h1>

      <Progress className="animate-pulse" value={50} />
    </>
  );
};

export default OrderStatusHeader;
