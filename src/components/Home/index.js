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
  const [text, setText] = useState("");

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

  const onChangeText = (event) => {
    setText(event.target.value);
  };
  const onCreateMessage = (event) => {
    firebase.messages().push({
      text,
    });

    setText("");
    event.preventDefault();
  };
  return (
    <div>
      {loading && <div>Loading...</div>}
      {messages ? (
        <MessageList messages={messages} />
      ) : (
        <div>There are no messages ...</div>
      )}
      <form onSubmit={onCreateMessage}>
        <input type="text" value={text} onChange={onChangeText} />
        <button type="submit">Send</button>
      </form>
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
