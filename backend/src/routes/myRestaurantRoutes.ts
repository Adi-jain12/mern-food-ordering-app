import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import {
  createMyRestaurant,
  getMyRestaurant,
  updateMyRestaurant,
  getMyRestaurantOrders,
  updateOrderStatus,
} from "../controllers/myRestaurantController";
import multer from "multer";
import { validateMyRestaurantRequest } from "../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage(); //stores any files i.e images from post request in memory not locally because getting the images and storing directly in cloudinary
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.get("/", jwtCheck, jwtParse, getMyRestaurant);

router.get("/orders", jwtCheck, jwtParse, getMyRestaurantOrders);

router.post(
  "/",
  upload.single("imageFile"),
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  createMyRestaurant
);

router.put(
  "/",
  upload.single("imageFile"),
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  updateMyRestaurant
);

router.patch("/order/:orderId/status", jwtCheck, jwtParse, updateOrderStatus);

export default router;
