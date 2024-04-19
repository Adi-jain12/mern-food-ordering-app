import { OrderStatus } from "@/types";

type OrderStatusInfo = {
  label: string;
  value: OrderStatus;
  progressValue: number;
  colorIndication: string;
};

export const ORDER_STATUS: OrderStatusInfo[] = [
  {
    label: "Placed",
    value: "placed",
    progressValue: 0,
    colorIndication: "blue",
  },
  {
    label: "Awaiting Restaurant Confirmation",
    value: "paid",
    progressValue: 25,
    colorIndication: "yellow",
  },

  {
    label: "In Progress",
    value: "inProgress",
    progressValue: 50,
    colorIndication: "yellow",
  },

  {
    label: "Out for Delivery",
    value: "outForDelivery",
    progressValue: 75,
    colorIndication: "green",
  },
  {
    label: "Delivered",
    value: "delivered",
    progressValue: 100,
    colorIndication: "green",
  },
];
