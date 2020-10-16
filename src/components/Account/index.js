import React, { useState, useEffect } from "react";

import { PasswordForgetForm } from "../PasswordForget";
import PasswordChangeForm from "../PasswordChange";
import { withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import { defaultProps } from "recompose";

const SIGN_IN_METHODS = [
  {
    id: "password",
    provider: null,
  },
  {
    id: "google.com",
    provider: "googleProvider",
  },
  {
    id: "facebook.com",
    provider: "facebookProvider",
  },
  {
    id: "twitter.com",
    provider: "twitterProvider",
  },
];

const AccountPage = ({ authUser }) => {
  console.log(authUser);
  return (
    <div>
      <h1>Account: {authUser.email}</h1>
      <PasswordForgetForm />
      <PasswordChangeForm />
      <LoginManagement authUser={authUser} />
    </div>
  );
};

const LoginManagementBase = ({ firebase, authUser }) => {
  const [activeSignInMethods, setActiveSignInMethods] = useState([]);
  const [error, setError] = useState(null);

  const fetchSignInMethods = () => {
    firebase.auth
      .fetchSignInMethodsForEmail(authUser.email)
      .then((activeSignInMethods) => {
        setActiveSignInMethods(activeSignInMethods);
        setError(null);
      })
      .catch((err) => setError(err));
  };

  const onSocialLoginLink = (provider) => {
    firebase.auth.currentUser
      .linkWithPopup(firebase[provider])
      .then(fetchSignInMethods)
      .catch((err) => setError(err));
  };

  const onDefaultLoginLink = (password) => {
    const credential = firebase.emailAuthProvider.credential(
      authUser.email,
      password
    );

    firebase.auth.currentUser
      .linkWithCredential(credential)
      .then(fetchSignInMethods)
      .catch((err) => setError(err));
  };

  const onUnlink = (providerId) => {
    firebase.auth.currentUser
      .unlink(providerId)
      .then(fetchSignInMethods)
      .catch((err) => setError(err));
  };

  useEffect(() => {
    fetchSignInMethods();
  }, []);

  return (
    <div>
      Sign In Methods:
      <ul>
        {SIGN_IN_METHODS.map((signInMethod) => {
          const onlyOneLeft = activeSignInMethods.length === 1;
          const isEnabled = activeSignInMethods.includes(signInMethod.id);
          return (
            <li key={signInMethod.key}>
              {signInMethod.id === "password" ? (
                <DefaultLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onLink={onDefaultLoginLink}
                  onUnlink={onUnlink}
                />
              ) : (
                <SocialLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onLink={onSocialLoginLink}
                  onUnlink={onUnlink}
                />
              )}
            </li>
          );
        })}
      </ul>
      {error && error.message}
    </div>
  );
};

const SocialLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink,
}) =>
  isEnabled ? (
    <button
      type="button"
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}
    >
      Deactivate {signInMethod.id}
    </button>
  ) : (
    <button onClick={() => onLink(signInMethod.provider)}>
      Link {signInMethod.id}
    </button>
  );

const DefaultLoginToggle = ({
  onLink,
  signInMethod,
  onUnlink,
  isEnabled,
  onlyOneLeft,
}) => {
  const [passwordOne, setPasswordOne] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();

    onLink(passwordOne);
    setPasswordOne("");
    setPasswordTwo("");
  };

  const onChange = (setFunction) => (event) => {
    setFunction(event.target.value);
  };

  const isInvalid = passwordOne !== passwordTwo || passwordOne === "";
  return isEnabled ? (
    <button
      type="button"
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}
    >
      Deactivate {signInMethod.id}
    </button>
  ) : (
    <form onSubmit={onSubmit}>
      {" "}
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={onChange(setPasswordOne)}
        type="password"
        placeholder="New Password"
      />{" "}
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange(setPasswordTwo)}
        type="password"
        placeholder="Confirm your password"
      />{" "}
      <button disabled={isInvalid} type="submit">
        {" "}
        Link {signInMethod.id}
      </button>
    </form>
  );
};

const condition = (authUser) => authUser != null;

const LoginManagement = withFirebase(LoginManagementBase);

export default withAuthorization(condition)(AccountPage);
