import { Order } from "@/types";
import { Progress } from "../ui/progress";
import { ORDER_STATUS } from "@/config/order-status-config";

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
    const paddedHours = hours < 10 ? `0${hours}` : hours;

    return `${paddedHours}:${paddedMinutes}`; // 12:04
  };

  const getOrderStatusInfo = () => {
    return (
      ORDER_STATUS.find((status) => status.value === order.status) ||
      ORDER_STATUS[0]
    );
  };

  const color = getOrderStatusInfo
    ? getOrderStatusInfo().colorIndication
    : "slate";

  const color2 = `bg-${color}-200 border-${color}-600`;

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight flex flex-col gap-5 md:flex-row md:justify-between">
        <span className="flex items-center">
          Order Status :
          <span
            className={`ml-4 p-1 text-sm tracking-normal font-medium ${color2} border-2 rounded-lg`}
          >
            {getOrderStatusInfo().label}
          </span>
        </span>
        <span>Expected by : {getExpectedDelivery()}</span>
      </h1>

      <Progress
        className="animate-pulse"
        value={getOrderStatusInfo().progressValue}
      />
    </>
  );
};

export default OrderStatusHeader;
