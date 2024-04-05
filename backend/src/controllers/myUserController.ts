import { Request, Response } from "express";
import User from "../models/user";

export const createUser = async (req: Request, res: Response) => {
  //1. check if the user exists
  //2. create the user if it doesnt exist
  //3. return the user object to the client

  try {
    const { auth0Id } = req.body;

    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      return res.status(200).send();
    }

    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json(newUser.toObject()); //toObject() does is it converts the document into plain old JS which excludes version no. and all the extra stuff from it and sends to the client
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, city, country } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ messsage: "User not found" });
    }

    //reason updating this way is to be specific to update specific fields only and it automatically ignores extra data
    user.name = name;
    user.addressLine1 = addressLine1;
    user.country = country;
    user.city = city;

    await user.save();

    res.send(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user profile" });
  }
};

export const getProfileDetails = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Somthin went wrong" });
  }
};
