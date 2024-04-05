import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { createRestaurant } from "../controllers/myRestaurantController";

const router = express.Router();

router.post("/", jwtCheck, jwtParse, createRestaurant);

export default router;
