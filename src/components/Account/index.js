import React from "react";

import { PasswordForgetForm } from "../PasswordForget";
import PasswordChangeForm from "../PasswordChange";
import { withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

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
    id: "facebook.cok",
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

const LoginManagementBase = () => {
  return (
    <div>
      Sign In Methods:
      <ul>
        {SIGN_IN_METHODS.map((SignInMethod) => {
          return (
            <li key={SignInMethod.key}>
              <button type="button" onClick={() => {}}>
                {SignInMethod.id}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const condition = (authUser) => authUser != null;

const LoginManagement = withFirebase(LoginManagementBase);

export default withAuthorization(condition)(AccountPage);
