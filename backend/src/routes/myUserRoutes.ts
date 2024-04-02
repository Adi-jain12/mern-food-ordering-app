import express from "express";
import { createUser } from "../controllers/myUserController";
import { jwtCheck } from "../middleware/auth";

const router = express.Router();

router.post("/", jwtCheck, createUser);

export default router;
