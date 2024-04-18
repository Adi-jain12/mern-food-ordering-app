import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import {
  createCheckoutSession,
  stripeWebhookHandler,
  myOrderDetails,
} from "../controllers/orderController";

const router = express.Router();

router.get("/", jwtCheck, jwtParse, myOrderDetails);

router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse,
  createCheckoutSession
);

router.post("/checkout/webhook", stripeWebhookHandler);

export default router;
