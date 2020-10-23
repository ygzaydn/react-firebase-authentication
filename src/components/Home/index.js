import React, { useState, useEffect } from "react";
import { withAuthorization, withEmailVerification } from "../Session";
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

  useEffect(() => {
    setLoading(true);
    firebase.messages().on("value", (snapshot) => {
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
    return () => firebase.messages().off;
  }, []);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {messages ? (
        <MessageList messages={messages} />
      ) : (
        <div>There are no messages ...</div>
      )}
    </div>
  );
};

const MessageList = ({ messages }) => (
  <ul>
    {messages.map((message) => (
      <MessageItem key={message.uid} message={message} />
    ))}
  </ul>
);

const MessageItem = ({ message }) => (
  <li>
    <strong>{message.userId}</strong> {message.text}
  </li>
);

const Messages = withFirebase(MessagesBase);

const condition = (authUser) => authUser != null;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(HomePage);
