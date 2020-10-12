import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const SignInPage = () => {
  return (
    <div>
      <h1>Sign In</h1>
      <SignInForm />
      <SignUpLink />
      <PasswordForgetLink />
    </div>
  );
};

export default SignInPage;

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

export const SignInForm = compose(withFirebase, withRouter)(SignInFormBase);
