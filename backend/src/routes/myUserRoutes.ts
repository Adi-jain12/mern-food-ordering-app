import express from "express";
import {
  createUser,
  getProfileDetails,
  updateProfile,
} from "../controllers/myUserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();

router.get("/", jwtCheck, jwtParse, getProfileDetails);
router.post("/", jwtCheck, createUser);
router.put("/update", jwtCheck, jwtParse, validateMyUserRequest, updateProfile);
export default router;
