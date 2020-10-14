import React, { useState, useEffect } from "react";
import { compose } from "recompose";

import { withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import * as ROLES from "../../constants/roles";

const AdminPage = ({ firebase }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);

  useEffect(() => {
    setLoading(true);
    firebase.users().on("value", (snapshot) => {
      const usersObject = snapshot.val();
      const usersList = Object.keys(usersObject).map((key) => ({
        ...usersObject[key],
        uid: key,
      }));
      setUser(usersList);
      setLoading(false);
    });
    return () => {
      firebase.users().off();
    };
  }, []);

  return (
    <div>
      <h1>Admin</h1>
      {loading && <div>Loading ... </div>}
      <UserList users={user} />
    </div>
  );
};
const condition = (authUser) => authUser && authUser.roles[ROLES.ADMIN];

const UserList = ({ users }) => (
  <ul>
    {users.map((user) => (
      <li key={user.uid}>
        <span>
          <strong> ID: </strong> {user.uid}
        </span>
        <span>
          <strong> E-mail: </strong> {user.email}
        </span>
        <span>
          <strong> Username: </strong> {user.username}
        </span>
      </li>
    ))}
  </ul>
);

export default compose(withAuthorization(condition), withFirebase)(AdminPage);
