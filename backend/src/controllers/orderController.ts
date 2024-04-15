import { Request, Response } from "express";

import Stripe from "stripe";
import Restaurant, { MenuItemType } from "../models/restaurant";

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

    //creating this function with passing the whole checkoutsessionRequest and restaurant.menuItems for fetching price from backend because stripe expects some line data to set
    const lineItems = createLineItems(
      checkoutSessionRequest,
      restaurant.menuItems
    );
  } catch (error: any) {
    res.status(500).json({ message: error.raw.message }); // error.raw show descriptive error coming from stripe
  }
};

const createLineItems = (
  createCheckoutSession: CheckoutSessionRequest,
  menuItems: MenuItemType[]
) => {};
