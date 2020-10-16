import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";

import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

const SignUpPage = () => {
  return (
    <div>
      <h1>Sign Up</h1>
      <SignUpForm />
    </div>
  );
};

const ERROR_CODE_ACCOUNT_EXISTS = "auth/email-already-in-use";
const ERROR_MSG_ACCOUNT_EXISTS =
  "An account with this e-mail address already exits. Try to login with this account instead. If you think the account is already used from one of the social logins, try to sign-in with one of them. Afterward, associate your accounts on your personal account page";

export const SignUpFormBase = ({ firebase, history }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [passwordOne, setPasswordOne] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = (event) => {
    firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        return firebase.user(authUser.user.uid).set({ username, email, roles });
      })
      .then(() => {
        return firebase.doSendEmailVerification();
      })
      .then(() => {
        setUsername("");
        setEmail("");
        setPasswordOne("");
        setPasswordTwo("");
        setError(null);
        history.push(ROUTES.HOME);
      })
      .catch((error) => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        setError(error);
      });

    event.preventDefault();
  };
  const onChange = (setFunction) => (event) => {
    setFunction(event.target.value);
  };
  const onChangeCheckbox = () => {
    setIsAdmin(!isAdmin);
  };

  const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === "" ||
    email === "" ||
    username === "";

  const roles = {};

  if (isAdmin) {
    roles[ROLES.ADMIN] = ROLES.ADMIN;
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        name="username"
        value={username}
        onChange={onChange(setUsername)}
        type="text"
        placeholder="Full Name"
      />
      <input
        name="email"
        value={email}
        onChange={onChange(setEmail)}
        type="text"
        placeholder="Email Adress"
      />
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={onChange(setPasswordOne)}
        type="password"
        placeholder="Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange(setPasswordTwo)}
        type="password"
        placeholder="Confirm Password"
      />
      <label>
        Admin:
        <input
          name="isAdmin"
          type="checkbox"
          value={isAdmin}
          onChange={onChangeCheckbox}
        />
      </label>
      <button disabled={isInvalid} type="submit">
        Sign Up
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

export const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);

export default SignUpPage;
