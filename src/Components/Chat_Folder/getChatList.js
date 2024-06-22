import { useEffect, useState } from "react";
import { db, store } from "../../Config/firebase";
import { Link, useNavigate } from "react-router-dom";

function ChatList() {
  const [user, setUsers] = useState([]);
  const [chatList, setchatList] = useState([]);
  const [currentUserId, setcurrentUserId] = useState("");
  const nav = useNavigate()
  // The current user's ID

 const  getData=()=>{
    var id = localStorage.getItem("userId");
    setcurrentUserId(id);
    var data = [];
    const query1 = store.collection("conversions").where("senderId", "==", id);

    // Query to get users where status is equal to "active"
    const query2 = store
      .collection("conversions")
      .where("recieverId", "==", id);

    // Execute both queries
    Promise.all([query1.get(), query2.get()])
      .then((results) => {
        const allDocs = [];

        results.forEach((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // Merge results, avoiding duplicates
            if (!allDocs.some((existingDoc) => existingDoc.id === doc.id)) {
              allDocs.push(doc);
            }
          });
        });

        // Process the merged results
        allDocs.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          data.push(doc.data());
        });
        setchatList(data);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    setUsers(data);
  }

  useEffect( () => {
   getData()
  }, []);

  const sendChatPage=(val)=>{
    localStorage.setItem("conversionId", val.conversionId);
    localStorage.setItem(
      "recieverId",
      val.senderId == currentUserId ? val.recieverId : val.senderId
    );
    nav("/MessageScreen")

  }

  return (
    <>
    <div style={{display:"flex",justifyContent:"space-around"}}>
    <Link to={"/user"}>User List  Page</Link>
    <Link to={"/Request"}>Request</Link>
    <Link to={"/ChatList"}>Friends List</Link>
    

    </div>
    
      <h1 style={{ textAlign: "center" }}>Chat Users</h1>
      {user.map((val, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            borderBottom: "1px solid #ccc",
            margin: "40px",
          }}
        >
          <div>
            {/* <div><strong>ID:</strong> {val.userId}</div> */}
            <div>
              <strong>Name:</strong>{" "}
              {val.senderId == currentUserId
                ? val.RecieveruserName
                : val.senderuserName}
            </div>
            <div>
              <strong>Email:</strong>{" "}
              {val.senderId == currentUserId
                ? val.Recieveremail
                : val.senderemail}
            </div>
          </div>
          <div>
            <button
              onClick={() => {
               sendChatPage(val)
              }}
            >
              Chat
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
export default ChatList;
