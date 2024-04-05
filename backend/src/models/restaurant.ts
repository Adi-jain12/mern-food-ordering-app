import mongoose, { Schema } from "mongoose";

const restaurantSchema = new mongoose.Schema({
  restaurantName: {
    type: String,
    required: true,
  },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
