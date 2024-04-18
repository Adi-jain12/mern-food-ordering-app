import { Request, Response } from "express";

import Stripe from "stripe";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order from "../models/order";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string); // makes a connection with stripe
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

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
  let event;

  try {
    const sig = req.headers["stripe-signature"];

    // this logic is going to work if any event is coming from stripe
    //here stripe is goint to verify that req.body is coming from stripe by using the STRIPE_ENDPOINT_SECRET and if it has then it will contruct the event with contructEvent func and give us the result in event object
    event = STRIPE.webhooks.constructEvent(
      req.body,
      sig as string,
      STRIPE_ENDPOINT_SECRET
    );
  } catch (error: any) {
    return res.status(400).send(`Webhook error : ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const order = await Order.findById(event.data.object.metadata?.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.totalAmount = event.data.object.amount_total;
    order.status = "paid";

    await order.save();
  }

  res.status(200).send();
};

export const myOrderDetails = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("restaurant")
      .populate("user");

    if (!orders) {
      return res.status(400).json({ message: "Orders not found" });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
