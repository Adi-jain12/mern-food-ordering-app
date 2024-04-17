import { Request, Response } from "express";

import Stripe from "stripe";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order from "../models/order";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string); // makes a connection with stripe
const FRONTEND_URL = process.env.FRONTEND_URL as string;

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];

  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };

  restaurantId: string;
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const newOrder = new Order({
      restaurant: restaurant,
      user: req.userId,
      status: "placed",
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      createdAt: new Date(),
    });

    //creating this function with passing the whole checkoutsessionRequest and restaurant.menuItems for fetching price from backend because stripe expects some line data to set
    const lineItems = createLineItems(
      checkoutSessionRequest,
      restaurant.menuItems
    );

    // this func is used to create session when user enters the card details and all
    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      restaurant.deliveryPrice,
      restaurant._id.toString()
    );

    // Here, session.url is the url of hosted page on stripe
    if (!session.url) {
      return res.status(500).json({ message: "Error creating stripe session" });
    }

    //saving the order in DB only if the above stripe payment logic successfully completes
    await newOrder.save();

    // return session url to the frontend
    res.json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ message: error.raw.message }); // error.raw show descriptive error coming from stripe
  }
};

const createLineItems = (
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: MenuItemType[]
) => {
  // 1. foreach cartItem, get the menuItem object from the restaurant (to get the price)
  // 2. foreach cartItem, convert it to a stripe line item
  // 3. return line item array

  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    );

    if (!menuItem) {
      throw new Error(`Menu item not found : ${cartItem.menuItemId}`);
    }

    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "inr",
        unit_amount: menuItem.price,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: parseInt(cartItem.quantity),
    };

    return line_item;
  });

  return lineItems;
};

const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number,
  restaurantId: string
) => {
  // this is to create session with stripe with the data entered behind the scene
  const sessionData = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: deliveryPrice,
            currency: "inr",
          },
        },
      },
    ],
    mode: "payment",

    //metadata is used to store additional data for every payment so that it can be used
    metadata: {
      orderId,
      restaurantId,
    },

    success_url: `${FRONTEND_URL}/order-status?success=true`, // if success after adding payment details it will be redirected to order status page
    cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`, // if user cancelled the payment it will be redirected to restaurant details page so that they can review the cart items again
  });

  // console.log(sessionData);

  return sessionData;
};

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  console.log("RECEIVED EVENT");
  console.log("=============");
  console.log("event: ", req.body);
  res.send();
};
