import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../models/user";

//if we want to add custom properties to express Request
declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

//this jwtCheck is a func which will be used in routes which we want to protect, so when the user logs in it will go through auth() func for bearer token check and also it will send the token to auth0 to verify if the token we get in request belongs to logged in user
// auth() is a function that we get from OAuth package that connects us to our auth0 service based on the credentials that we used when creating the account and it validates if jwt token that we get from the req is indeed comes from our auth0 server
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  // headers field property gonna look like this : Bearer kgbsidubgrkerbkbsfgarfgtfhs
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.sendStatus(401);
  }

  //Bearer slfbvslkurgbliaubrgrgbosbfvo => getting the token from authorization string
  const token = authorization.split(" ")[1];

  try {
    //decoding the token using jsonwebtoken package
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    // Getting the user's auth0Id out of the decoded token
    const auth0Id = decoded.sub;

    const user = await User.findOne({ auth0Id });

    if (!user) {
      return res.sendStatus(401);
    }

    //forwarding the values to req so that controllers can make use of these sent values
    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();

    next();
  } catch (error) {
    return res.sendStatus(401);
  }
};
