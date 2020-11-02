import React, { useState, useEffect } from "react";
import {
  withAuthorization,
  withEmailVerification,
  AuthUserContext,
} from "../Session";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";

const HomePage = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>The Home Page is accessible by every signed in user</p>
      <Messages />
    </div>
  );
};

const MessagesBase = ({ firebase }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    onListenForMessages();
    return () => firebase.messages().off;
  }, []);

  const onListenForMessages = () => {
    setLoading(true);
    firebase
      .messages()
      .orderByChild("createdAt")
      .limitToLast(limit)
      .on("value", (snapshot) => {
        const messageObject = snapshot.val();

        if (messageObject) {
          const messageList = Object.keys(messageObject).map((key) => ({
            ...messageObject[key],
            uid: key,
          }));
          setLoading(false);
          setMessages(messageList);
        } else {
          setLoading(false);
          setMessages(null);
        }
      });
  };

  const onNextPage = () => {
    setLimit(limit + 5);
    onListenForMessages();
  };
  const onChangeText = (event) => {
    setText(event.target.value);
  };
  const onCreateMessage = (authUser) => (event) => {
    firebase.messages().push({
      text,
      userId: authUser.uid,
      createdAt: firebase.serverValue.TIMESTAMP,
    });

    setText("");
    event.preventDefault();
  };
  const onRemoveMessage = (uid) => {
    firebase.message(uid).remove();
  };
  const onEditMessage = (message, text) => {
    const { uid, ...messageSnapshot } = message;
    firebase.message(message.uid).set({
      ...messageSnapshot,
      text,
      editedAt: firebase.serverValue.TIMESTAMP,
    });
  };

  return (
    <AuthUserContext.Consumer>
      {(authUser) => (
        <div>
          {!loading && messages && (
            <button type="button" onClick={onNextPage}>
              More
            </button>
          )}
          {loading && <div>Loading...</div>}
          {messages ? (
            <MessageList
              messages={messages}
              authUser={authUser}
              onRemoveMessage={onRemoveMessage}
              onEditMessage={onEditMessage}
            />
          ) : (
            <div>There are no messages ...</div>
          )}
          <form onSubmit={onCreateMessage(authUser)}>
            <input type="text" value={text} onChange={onChangeText} />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </AuthUserContext.Consumer>
  );
};

const MessageList = ({
  authUser,
  messages,
  onRemoveMessage,
  onEditMessage,
}) => (
  <ul>
    {messages.map((message) => (
      <MessageItem
        authUser={authUser}
        key={message.uid}
        message={message}
        onRemoveMessage={onRemoveMessage}
        onEditMessage={onEditMessage}
      />
    ))}
  </ul>
);

const MessageItem = ({ authUser, message, onRemoveMessage, onEditMessage }) => {
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(message.text);

  const onToggleEditMode = () => {
    setEditMode(!editMode);
    setEditText(message.text);
  };
  const onChangeEditText = (event) => {
    setEditText(event.target.value);
  };
  const onSaveEditText = () => {
    onEditMessage(message, editText);
    setEditMode(false);
  };
  return (
    <li>
      {editMode ? (
        <input type="text" value={editText} onChange={onChangeEditText} />
      ) : (
        <span>
          <strong>{message.userId}</strong> {message.text}
          {message.editedAt && <span>(Edited)</span>}
        </span>
      )}
      {authUser.uid === message.userID && (
        <span>
          {editMode ? (
            <span>
              <button onClick={onSaveEditText}>Save</button>
              <button onClick={onToggleEditMode}>Reset</button>
            </span>
          ) : (
            <button onClick={onToggleEditMode}>Edit</button>
          )}
          {!editMode && (
            <button type="button" onClick={() => onRemoveMessage(message.uid)}>
              Delete{" "}
            </button>
          )}
        </span>
      )}
    </li>
  );
};

const Messages = withFirebase(MessagesBase);

const condition = (authUser) => authUser != null;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(HomePage);
