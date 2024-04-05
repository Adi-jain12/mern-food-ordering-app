import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { createRestaurant } from "../controllers/myRestaurantController";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage(); //stores any files i.e images from post request in memory not locally because getting the images and storing directly in cloudinary
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post(
  "/",
  jwtCheck,
  jwtParse,
  upload.single("imageFile"),
  createRestaurant
);

export default router;
