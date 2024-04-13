import { useGetRestaurantDetails } from "@/api/RestaurantApi";
import MenuItem from "@/components/DetailsPage/MenuItem";
import OrderSummary from "@/components/DetailsPage/OrderSummary";
import RestaurantInfo from "@/components/DetailsPage/RestaurantInfo";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { MenuItem as MenuItemType } from "@/types";
import { useState } from "react";

import { useParams } from "react-router-dom";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

const DetailsPage = () => {
  const { restaurantId } = useParams();

  const { restaurantDetails, isLoading } =
    useGetRestaurantDetails(restaurantId);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (menuItem: MenuItemType) => {
    setCartItems((prevCartItems) => {
      // 1. check if the item is already in the cart
      const existingCartItems = prevCartItems.find(
        (cartItem) => cartItem._id === menuItem._id
      );

      let updatedCartItems;

      // 2. if item is in cart, update the quantity
      if (existingCartItems) {
        updatedCartItems = prevCartItems.map((cartItem) =>
          cartItem._id === menuItem._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      // 3. if item is not in cart, add it as a new item
      else {
        updatedCartItems = [
          ...prevCartItems,
          {
            _id: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
          },
        ];
      }

      return updatedCartItems;
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setCartItems((prevCartItems) => {
      const removeCartItem = prevCartItems.filter(
        (cartItem) => cartItem._id !== menuItemId
      );

      return removeCartItem;
    });
  };

  if (isLoading || !restaurantDetails) {
    return <span>Loading...</span>;
  }

  return (
    <div className="flex flex-col gap-10">
      <AspectRatio ratio={16 / 5}>
        <img
          src={restaurantDetails.imageUrl}
          className="rounded-md object-cover h-full w-full"
        />
      </AspectRatio>

      <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
        <div className="flex flex-col gap-4">
          <RestaurantInfo restaurant={restaurantDetails} />
          <span className="text-2xl font-bold tracking-tight">Menu</span>
          {restaurantDetails.menuItems.map((menuItem) => (
            <MenuItem
              menuItem={menuItem}
              addToCart={() => addToCart(menuItem)}
            />
          ))}
        </div>

        <div>
          <Card>
            <OrderSummary
              restaurant={restaurantDetails}
              cartItems={cartItems}
              removeCartItem={removeFromCart}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
