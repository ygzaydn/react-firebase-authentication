import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const withAuthorization = (condition) => (Component) => {
  const WithAuthorization = (props) => {
    useEffect(() => {
      props.firebase.auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          props.firebase
            .user(authUser.uid)
            .once("value")
            .then((snapshot) => {
              const dbUser = snapshot.val();
              if (!dbUser.roles) {
                dbUser.roles = {};
              }
              authUser = {
                uid: authUser.uid,
                email: authUser.email,
                ...dbUser,
              };
            });
          if (!condition(authUser)) {
            props.history.push(ROUTES.SIGN_IN);
          }
        } else {
          props.history.push(ROUTES.SIGN_IN);
        }
      });
    }, []);

    return (
      <AuthUserContext.Consumer>
        {(authUser) =>
          condition(authUser) ? (
            <Component {...props} authUser={authUser} />
          ) : null
        }
      </AuthUserContext.Consumer>
    );
  };

  return compose(withRouter, withFirebase)(WithAuthorization);
};

export default withAuthorization;
