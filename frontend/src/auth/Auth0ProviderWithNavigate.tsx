import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

const Auth0ProviderWithNavigate = ({ children }: Props) => {
  const navigate = useNavigate();

  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  if (!domain || !clientId || !redirectUri || !audience) {
    throw new Error("Unable to initialize auth");
  }

  //appState variable : It is going to contain some stored data that we might need when the user gets redirected back to our app after they login. Eg: We are going to store the current URL that the user was on in App State before we send them to the login page and that way when they get redirected back to us we can grab the url that they were in before from the App State and then we can use it in here to do whatever we want in this function i.e onRedirectCallback
  // user variable : It will store the user details of the logged in user
  //This function is called when the user logs in and it is redirected back to our app
  const onRedirectCallback = () => {
    // console.log("USER", user);

    navigate("/auth-callback"); // when the user logs in it will get redirect to AuthCallbackPage Component
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri, //whenever the user signs in on the Auth0 page, Auth0 will try to send the user back to our app and its going to try to send them to the URL that I have defined here i.e redirectUri and if this URL doesnt match the web origins that we have added to our auth0 its going to throw a big error. (Security thing)
        audience,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithNavigate;
