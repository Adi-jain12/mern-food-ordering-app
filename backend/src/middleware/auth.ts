import { auth } from "express-oauth2-jwt-bearer";

//this jwtCheck is a func which will be used in routes which we want to protect, so when the user logs in it will go through auth() func for bearer token check and also it will send the token to auth0 to verify if the token we get in request belongs to logged in user
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});
