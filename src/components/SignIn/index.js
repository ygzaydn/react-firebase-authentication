import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const ERROR_CODE_ACCOUNT_EXISTS =
  "auth/account-exists-with-different-credential";
const ERROR_MSG_ACCOUNT_EXISTS =
  "An account with an e-mail address to this social account already exists. Try to login from this account instead and associate your social accounts on your personal account page.";

const SignInPage = () => {
  return (
    <div>
      <h1>Sign In</h1>
      <SignInForm />
      <SignInGoogle />
      <SignInFacebook />
      <SignInTwitter />
      <SignUpLink />
      <PasswordForgetLink />
    </div>
  );
};

const SignInFormBase = ({ firebase, history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const onChange = (setFunction) => (event) => {
    setFunction(event.target.value);
  };

  const onSubmit = (event) => {
    firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        setEmail("");
        setPassword("");
        setError(null);
        history.push(ROUTES.HOME);
      })
      .catch((error) => {
        setError(error);
      });

    event.preventDefault();
  };
  const isInvalid = password === "" || email === "";

  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        value={email}
        onChange={onChange(setEmail)}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="password"
        value={password}
        onChange={onChange(setPassword)}
        type="password"
        placeholder="Password"
      />
      <button disabled={isInvalid} type="submit">
        Sign In
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignInGoogleBase = ({ firebase, history }) => {
  const [error, setError] = useState(null);

  const onSubmit = (event) => {
    firebase
      .doSignInWithGoogle()
      .then((socialAuthUser) => {
        console.log(socialAuthUser);
        if (socialAuthUser.additionalUserInfo.isNewUser) {
          firebase.user(socialAuthUser.user.uid).set({
            username: socialAuthUser.additionalUserInfo.profile.name,
            email: socialAuthUser.additionalUserInfo.profile.email,
            roles: {},
          });
        }
        setError(null);
        history.push(ROUTES.HOME);
      })
      .catch((err) => {
        if (err.code === ERROR_CODE_ACCOUNT_EXISTS) {
          err.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        setError(err);
      });
    event.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In With Google</button>
      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignInFacebookBase = ({ firebase, history }) => {
  const [error, setError] = useState(null);

  const onSubmit = (event) => {
    firebase
      .doSignInWithFacebook()
      .then((socialAuthUser) => {
        console.log(socialAuthUser);
        if (socialAuthUser.additionalUserInfo.isNewUser) {
          firebase.user(socialAuthUser.user.uid).set({
            username: socialAuthUser.additionalUserInfo.profile.name,
            email: socialAuthUser.additionalUserInfo.profile.email,
            roles: {},
          });
        }
        setError(null);
        history.push(ROUTES.HOME);
      })
      .catch((err) => {
        if (err.code === ERROR_CODE_ACCOUNT_EXISTS) {
          err.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        setError(err);
      });
    event.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In With Facebook</button>
      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignInTwitterBase = ({ firebase, history }) => {
  const [error, setError] = useState(null);

  const onSubmit = (event) => {
    firebase
      .doSignInWithTwitter()
      .then((socialAuthUser) => {
        console.log(socialAuthUser);
        if (socialAuthUser.additionalUserInfo.isNewUser) {
          firebase.user(socialAuthUser.user.uid).set({
            username: socialAuthUser.additionalUserInfo.profile.name,
            email: socialAuthUser.additionalUserInfo.providerId,
            roles: {},
          });
        }
        setError(null);
        history.push(ROUTES.HOME);
      })
      .catch((err) => {
        if (err.code === ERROR_CODE_ACCOUNT_EXISTS) {
          err.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        setError(err);
      });
    event.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In With Twitter</button>
      {error && <p>{error.message}</p>}
    </form>
  );
};

export const SignInForm = compose(withFirebase, withRouter)(SignInFormBase);
export default SignInPage;

const SignInGoogle = compose(withFirebase, withRouter)(SignInGoogleBase);
const SignInFacebook = compose(withFirebase, withRouter)(SignInFacebookBase);
const SignInTwitter = compose(withFirebase, withRouter)(SignInTwitterBase);
