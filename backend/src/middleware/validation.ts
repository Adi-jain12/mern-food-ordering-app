import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

// this middleware will check if any errors from validateMyUserRequest array is there and if it is there send the errors in array to client
const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req); // this will check if the array in req has any errors and if there is errors and it is not empty it will send the res with errors array
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("Name must be a string"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("AddressLine1 must be a string"),
  body("city").isString().notEmpty().withMessage("City must be a string"),
  body("country").isString().notEmpty().withMessage("Country must be a string"),

  handleValidationErrors,
];
