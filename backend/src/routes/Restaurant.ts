import express from "express";
import { validateSearchRequest } from "../middleware/validation";
import { searchRestaurants } from "../controllers/restaurantController";

const router = express.Router();

router.get("/search/:city", validateSearchRequest, searchRestaurants);

export default router;
