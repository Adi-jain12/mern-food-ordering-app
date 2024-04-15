import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/myUserRoutes";
import myRestaurantRoute from "./routes/myRestaurantRoutes";
import orderRoute from "./routes/orderRoutes";
import restaurantRoute from "./routes/Restaurant";
import { v2 as cloudinary } from "cloudinary";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected"));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(express.json());
app.use(cors());

//extra sanity check to check if the server has successfully started and we can make requests to the endpoints

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health OK!" }); //this convention is used by services like docker compose and kubernetes which they will call this /health endpoint and if they receive a valid response then it will assume that, that service is healthy.
});

app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myRestaurantRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/order", orderRoute);

app.listen(7000, () => {
  console.log("server started on localhost:7000");
});
