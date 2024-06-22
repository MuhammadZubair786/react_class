import { useEffect, useState } from "react";
import { db, store } from "../../Config/firebase";
import { Link } from "react-router-dom";

function MessageScreen() {
  const [users, setUsers] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentUserId, setcurrentUserId] = useState("");
  const [senderusername, setsenderusername] = useState("");
  const [senderuseremail, setsenderuseremail] = useState("");
  const [conversionId, setconversionId] = useState("");

  const [recieverId, setrecieverId] = useState("");
  const getData = () => {
    var id = localStorage.getItem("userId");
    var username = localStorage.getItem("userName");
    var email = localStorage.getItem("userEmail");
    var rid = localStorage.getItem("recieverId");

    setcurrentUserId(id);
    setsenderusername(username);
    setsenderuseremail(email);
    setrecieverId(rid);

    var data = [];
    const query1 = store
      .collection("conversions")
      .where("senderId", "==", currentUserId);
    const query2 = store
      .collection("conversions")
      .where("recieverId", "==", currentUserId);

    Promise.all([query1.get(), query2.get()])
      .then((results) => {
        const allDocs = [];
        results.forEach((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (!allDocs.some((existingDoc) => existingDoc.id === doc.id)) {
              allDocs.push(doc);
            }
          });
        });

        allDocs.forEach((doc) => {
          data.push(doc.data());
        });
        setChatList(data);
        setUsers(data);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  // const currentUserId = "QROyEo9JhbUF4PI8bfLDr4rhAeA2"; // The current user's ID

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    var conid = localStorage.getItem("conversionId");
    setconversionId(conid);

    const unsubscribe = store
      .collection("messages")
      .where("conversionId", "==", conid)

      .onSnapshot(
        (snapshot) => {
          const newMessages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(newMessages);
        },
        (error) => {
          console.error("Error listening to messages: ", error);
        }
      );

    return () => unsubscribe();
  }, [currentUserId]);

  const sendMessage = async (recipientId) => {
    if (!message.trim()) {
      return;
    }

    const newMessage = {
      text: message,
      senderId: currentUserId,
      recieverId: recipientId,
      timestamp: new Date(),
      conversionId: conversionId,
    };

    await store
      .collection("messages")
      .add(newMessage)
      .then(() => {
        console.log("Message sent successfully");
        setMessage(""); // Clear the input field
      })
      .catch((error) => {
        console.error("Error sending message: ", error);
      });
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Link to={"/user"}>User List Page</Link>
        <Link to={"/Request"}>Request</Link>
        <Link to={"/ChatList"}>Friend List Page</Link>
      </div>
      <h1 style={{ textAlign: "center" }}>Chat Users</h1>

      {console.log(users)}
      {users.map((val, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            borderBottom: "1px solid #ccc",
            margin: "40px",
          }}
        >
          <div>
            <div>
              <strong>Name:</strong>{" "}
              {val.senderId === currentUserId
                ? val.RecieveruserName
                : val.senderuserName}
            </div>
            <div>
              <strong>Email:</strong>{" "}
              {val.senderId === currentUserId
                ? val.Recieveremail
                : val.senderemail}
            </div>
          </div>
        </div>
      ))}
      <div>
        <h2>Messages</h2>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{ padding: "10px", borderBottom: "1px solid #ccc" }}
          >
            {msg.senderId == currentUserId ? (
              <p style={{ textAlign: "right" }}>
                <p>{msg.text}</p>
                <p>
                  <small>
                    {new Date(msg.timestamp.toDate()).toLocaleString()}
                  </small>
                </p>
              </p>
            ) : (
              <p>
                <p>{msg.text}</p>
                <p>
                  <small>
                    {new Date(msg.timestamp.toDate()).toLocaleString()}
                  </small>
                </p>
              </p>
            )}
          </div>
        ))}
      </div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(recieverId);
          }}
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            style={{ marginRight: "10px" }}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}

export default MessageScreen;
