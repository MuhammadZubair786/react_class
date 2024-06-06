import { useEffect, useState } from "react"
import { db, store } from "../../Config/firebase";

function MessageScreen() {
  const [users, setUsers] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const currentUserId = "QROyEo9JhbUF4PI8bfLDr4rhAeA2"; // The current user's ID

  useEffect(() => {
    var data = [];
    const query1 = store.collection("conversions").where("senderId", "==", currentUserId);
    const query2 = store.collection("conversions").where("recieverId", "==", currentUserId);

    Promise.all([query1.get(), query2.get()]).then((results) => {
      const allDocs = [];
      results.forEach((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (!allDocs.some(existingDoc => existingDoc.id === doc.id)) {
            allDocs.push(doc);
          }
        });
      });

      allDocs.forEach((doc) => {
        data.push(doc.data());
      });
      setChatList(data);
      setUsers(data);
    }).catch((error) => {
      console.log("Error getting documents: ", error);
    });
  }, []);

  useEffect(() => {
    // Listen for new messages in real-time
    const unsubscribe = store.collection("messages")
      .where("conversionId", "==", "NzhfmZ3Xdm6ahHf5a0m")
      // Ensure messages are ordered by timestamp
      .onSnapshot((snapshot) => {
        const newMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(newMessages);
      }, (error) => {
        console.error("Error listening to messages: ", error);
      });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  const sendRequest = async (index) => {
    var key = db.ref("Request").push().getKey();
    console.log(key);

    var obj = {
      "sendId": currentUserId,
      "recieverId": users[index]["userId"],
      "Request_status": "pending",
      "Request_id": key,
      "senderuserName": "sender",
      "senderemail": "sender email",
      "RecieveruserName": users[index]["name"],
      "Recieveremail": users[index]["email"]
    };

    await store.collection("Request").doc(key).set(obj)
      .then(() => {
        console.log("Request Sent Successfully");
        const updatedUsers = users.filter((_, i) => i !== index);
        setUsers(updatedUsers);
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  const sendMessage = async (recipientId) => {
    if (!message.trim()) {
      return;
    }

    const newMessage = {
      text: message,
      senderId: currentUserId,
      recieverId: recipientId,
      timestamp: new Date(),
      conversionId:"NzhfmZ3Xdm6ahHf5a0m"
    };

    await store.collection("messages").add(newMessage)
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
      <h1 style={{ textAlign: "center" }}>Chat Users</h1>
      {users.map((val, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            borderBottom: "1px solid #ccc",
            margin: "40px"
          }}
        >
          <div>
            <div><strong>Name:</strong> {val.senderId === currentUserId ? val.RecieveruserName : val.senderuserName}</div>
            <div><strong>Email:</strong> {val.senderId === currentUserId ? val.Recieveremail : val.senderemail}</div>
          </div>
          <div>
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(val.senderId === currentUserId ? val.recieverId : val.senderId); }}>
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
        </div>
      ))}
      <div>
        <h2>Messages</h2>
        {messages.map((msg) => (
          <div key={msg.id} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
            <p><strong>From:</strong> {msg.senderId}</p>
            <p><strong>To:</strong> {msg.recieverId}</p>
            <p>{msg.text}</p>
            <p><small>{new Date(msg.timestamp.toDate()).toLocaleString()}</small></p>
          </div>
        ))}
      </div>
    </>
  )
}

export default MessageScreen;
