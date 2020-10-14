import React, { useState, useEffect } from "react";

import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

export const withAuthentication = (Component) => {
  const WithAuthentication = (props) => {
    const [authUser, setAuthUser] = useState(
      JSON.parse(localStorage.getItem("authUser"))
    );
    useEffect(() => {
      props.firebase.onAuthUserListener(
        (authUser) => {
          localStorage.setItem("authUser", JSON.stringify(authUser));
          setAuthUser(authUser);
        },
        () => {
          setAuthUser(null);
          localStorage.removeItem("authUser");
        }
      );
    }, []);

    return (
      <AuthUserContext.Provider value={authUser}>
        <Component {...props} />
      </AuthUserContext.Provider>
    );
  };

  return withFirebase(WithAuthentication);
};
