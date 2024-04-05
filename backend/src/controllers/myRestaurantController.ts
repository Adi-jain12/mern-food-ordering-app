import { Request, Response } from "express";
import Restaurant from "../models/restaurant";

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const user = await Restaurant.findById(req.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const restaurant = new Restaurant(req.body);
    await restaurant.save();
  } catch (error) {
    res.status(500).json({ message: "Error creating restaurant" });
  }
};
