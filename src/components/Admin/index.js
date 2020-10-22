import React, { useState, useEffect } from "react";
import { compose } from "recompose";

import { Link, Switch, Route } from "react-router-dom";
import { withAuthorization, withEmailVerification } from "../Session";
import { withFirebase } from "../Firebase";
import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";

const AdminPage = () => {
  return (
    <div>
      <h1>Admin</h1>
      <p>The Admin Page is accessible by every signed in admin user.</p>
      <Switch>
        <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
        <Route exact path={ROUTES.ADMIN} component={UserList} />
      </Switch>
    </div>
  );
};

const UserListBase = ({ firebase }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setLoading(true);
    firebase.users().on("value", (snapshot) => {
      const usersObject = snapshot.val();
      const usersList = Object.keys(usersObject).map((key) => ({
        ...usersObject[key],
        uid: key,
      }));
      setUsers(usersList);
      setLoading(false);
    });
    return () => {
      firebase.users().off();
    };
  }, []);

  return (
    <div>
      <h2>Users</h2>
      {loading && <div>Loading...</div>}
      <ul>
        {users.map((user) => (
          <li key={user.uid}>
            <span>
              <strong>ID: </strong> {user.uid}
            </span>
            <span>
              <strong>E-mail: </strong> {user.email}
            </span>
            <span>
              <strong>Username: </strong> {user.username}
            </span>
            <span>
              <Link to={`${ROUTES.ADMIN}/${user.uid}`}>Details</Link>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const UserItemBase = ({ match, firebase }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true);
    firebase.user(match.params.id).on("value", (snapshot) => {
      setUser(snapshot.val());
      setLoading(false);
    });
    return () => {
      firebase.user(match.params.id).off();
    };
  }, []);

  return (
    <div>
      <h2>User ({match.params.id})</h2>
      {loading && <div>Loading...</div>}
      {user && (
        <div>
          <span>
            <strong>ID:</strong> {match.params.id}
          </span>
          <span>
            <strong>E-mail</strong> {user.email}
          </span>
          <span>
            <strong>Username:</strong> {user.username}
          </span>
          <span>
            <Link to={ROUTES.ADMIN}>Back</Link>
          </span>
        </div>
      )}
    </div>
  );
};

const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

const UserList = withFirebase(UserListBase);
const UserItem = withFirebase(UserItemBase);

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(AdminPage);
