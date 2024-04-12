import express from "express";
import {
  validateRestaurantRequest,
  validateSearchRequest,
} from "../middleware/validation";
import {
  searchRestaurants,
  getRestaurantDetails,
} from "../controllers/restaurantController";

const router = express.Router();

router.get("/search/:city", validateSearchRequest, searchRestaurants);
router.get("/:restaurantId", validateRestaurantRequest, getRestaurantDetails);
export default router;
