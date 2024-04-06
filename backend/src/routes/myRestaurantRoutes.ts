import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import {
  createMyRestaurant,
  getMyRestaurant,
  updateMyRestaurant,
} from "../controllers/myRestaurantController";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage(); //stores any files i.e images from post request in memory not locally because getting the images and storing directly in cloudinary
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.get("/", jwtCheck, jwtParse, getMyRestaurant);

router.post(
  "/",
  jwtCheck,
  jwtParse,
  upload.single("imageFile"),
  createMyRestaurant
);

router.put(
  "/",
  upload.single("imageFile"),
  jwtCheck,
  jwtParse,
  updateMyRestaurant
);

export default router;
