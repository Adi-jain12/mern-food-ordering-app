import { useCreateMyUser } from "@/api/MyUserApi";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
  const { user } = useAuth0();
  const { createUser } = useCreateMyUser();
  const navigate = useNavigate();

  const hasCreatedUser = useRef(false); // this ref is created so that when this component renders the first time it will have false value and when the user is created in useEffect the value of ref get flip to true, so if by any chance the useEffect renders again even if we define the dependencies this ref value will make sure that useEffect runs only one time (as changing ref value does not re render the component whereas state value does on changing)

  useEffect(() => {
    //whenever the user signs in it will send back the user with auth0Id and email which we can use to store in our DB
    if (user?.sub && user?.email && !hasCreatedUser.current) {
      //if !hasCreatedUser.current value is false then if case is going to run and createUser is called and then update ref value to true
      //user.sub is auth Id
      createUser({ auth0Id: user.sub, email: user.email });
      hasCreatedUser.current = true;
    }

    navigate("/"); //once the user is created successfully it will get navigate to home page
  }, [createUser, navigate, user]);

  return <>Loading...</>;
};

export default AuthCallbackPage;
