import React, { useState } from "react";

import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

const withEmailVerification = (Component) => {
  const WithEmailVerification = (props) => {
    const [isSent, setIsSent] = useState(false);
    const onSendEmailVerification = () => {
      props.firebase.doSendEmailVerification().then(() => setIsSent(true));
    };

    const needsEmailVerification = (authUser) => {
      console.log(authUser);
      return (
        authUser &&
        !authUser.emailVerified &&
        authUser.providerData.map((el) => el.providerId).includes("password")
      );
    };

    return (
      <AuthUserContext.Consumer>
        {(authUser) =>
          needsEmailVerification(authUser) ? (
            <div>
              {isSent ? (
                <p>
                  Confirmation e-mail is sent. Check your emails (spam folder
                  included) for a confirmation email. Refresh this page once you
                  confirmed your e-mail.
                </p>
              ) : (
                <p>
                  Verify your E-mail: Check your emails (spam folder included)
                  for a confirmation e-mail or send another confirmation e-mail.
                </p>
              )}
              <button
                type="button"
                onClick={onSendEmailVerification}
                disabled={isSent}
              >
                {" "}
                Send confirmation E-mail
              </button>
            </div>
          ) : (
            <Component {...props} />
          )
        }
      </AuthUserContext.Consumer>
    );
  };

  return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
