import { Request, Response } from "express";
import Restaurant from "../models/restaurant";

export const searchRestaurants = async (req: Request, res: Response) => {
  try {
    const city = req.params.city;

    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;

    let query: any = {};

    //Eg : city = vadodara or Vadodara
    query["city"] = new RegExp(city, "i"); // creating a query with option city to go and get the all restaurants where the city field matches the RegExp

    const cityCheck = await Restaurant.countDocuments(query); // counting documents from mongodb if we match the query i.e city = vadodara

    if (cityCheck === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      }); //the reason we are sending in this format in response because client expects this format so if we send empty array and pagination wih default values in response in client we can handle it easily.
    }

    if (selectedCuisines) {
      //URL = selectedCuisines = indian, italian, burgers, chinese
      // .split will return a new array with [indian, italian, burgers, chinese]
      // then will perform some regex with each cuisine
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));

      query["cuisines"] = { $all: cuisinesArray }; //this will create a cuisines option in query and $all will search for all documents which matches the cuisinesArray and returns the matched restaurants documents
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");

      // restaurntName = Pizza palace
      // cuisines = [Pizza, Pasta, Italian]
      // searchQuery = pasta
      // so it will check from both restaurantName or cuisines and if searchQuery matches in any restaurantName or cuisines field it will return the result
      query["$or"] = [
        {
          restaurantName: searchRegex,
        },
        { cuisines: { $in: [searchRegex] } },
      ];
    }

    const pageSize = 10;
    const skip = (page - 1) * 10; // Eg : if we request page no.2 so it will be (2-1) *10 = 10, so skip 10 results to be on page 2

    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 }) //sortOption = "lastUpdated" or anything from req.sortOpion as it is dynamic therefore using [sortOption] for dynamic value
      .skip(skip)
      .limit(pageSize)
      .lean(); // lean will strip out all the metadata and _ids to return the response without them.

    const total = await Restaurant.countDocuments(query); // to count restaurants

    const response = {
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize), // total = 50 results, pageSize = 10 => pages = 5. This pagination object wil be used in client side to display pages in pagination easily
      },
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
