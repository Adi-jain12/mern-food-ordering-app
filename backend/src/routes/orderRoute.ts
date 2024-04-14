import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { getMyOrders } from "../controllers/orderController";

const router = express.Router();

router.get("/", jwtCheck, jwtParse, getMyOrders);

export default router;
