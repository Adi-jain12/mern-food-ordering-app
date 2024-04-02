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
