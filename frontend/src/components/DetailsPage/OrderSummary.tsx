import { CartItem } from "@/pages/DetailsPage";
import { Restaurant } from "@/types";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Trash } from "lucide-react";

type Props = {
  restaurant: Restaurant;
  cartItems: CartItem[];
  removeCartItem: (cartItemId: string) => void;
};

const OrderSummary = ({ restaurant, cartItems, removeCartItem }: Props) => {
  const getTotalCost = () => {
    const totalCost = cartItems.reduce(
      (total, cartItem) => total + cartItem.price * cartItem.quantity,
      0
    );

    const totalWithDelivery = totalCost + restaurant.deliveryPrice;

    return totalWithDelivery;
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight flex justify-between">
          <span>Your Order</span>
          <span>₹{getTotalCost()}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {cartItems.map((cartItem) => (
          <div className="flex justify-between">
            <span>
              <Badge variant="outline" className="mr-2">
                {cartItem.quantity}
              </Badge>
              {cartItem.name}
            </span>

            <span className="flex items-center gap-1">
              <Trash
                className="cursor-pointer"
                color="red"
                size={20}
                onClick={() => removeCartItem(cartItem._id)}
              />
              ₹{cartItem.quantity * cartItem.price}
            </span>
          </div>
        ))}

        <Separator />

        <div className="flex justify-between">
          <span>Delivery</span>
          <span>₹{restaurant.deliveryPrice}</span>
        </div>

        <Separator />
      </CardContent>
    </>
  );
};

export default OrderSummary;
