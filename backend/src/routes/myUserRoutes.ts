import express from "express";
import { createUser } from "../controllers/myUserController";

const router = express.Router();

router.post("/", createUser);

export default router;
