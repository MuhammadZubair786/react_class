import { useEffect, useState } from "react";
import { db, store } from "../../Config/firebase";
import { Link, useNavigate } from "react-router-dom";

function RequestList() {
  const [requests, setRequests] = useState([]);
  // const currentUserId = ""; // The current user's ID
  const [currentUserId, setcurrentUserId] = useState("");
  const [senderusername, setsenderusername] = useState("");
  const [senderuseremail, setsenderuseremail] = useState("");
  var nav = useNavigate()

  const getData=async ()=>{
    var id = localStorage.getItem("userId")
    var username = localStorage.getItem("userName")
    var email =localStorage.getItem("userEmail")

    setcurrentUserId( id)
    setsenderusername(username);
    setsenderuseremail(email);

    var data = [];

    // Fetch friend requests where current user is either the sender or the receiver
    const sentRequestsSnapshot = await store
      .collection("Request")
      .where("senderId", "==", id)
      .get();

    const sentRequests = [];
    sentRequestsSnapshot.forEach((doc) => {
      sentRequests.push(doc.data());
    });

    const receivedRequestsSnapshot = await store
      .collection("Request")
      .where("recieverId", "==", id)
      .get();

    const receivedRequests = [];
    receivedRequestsSnapshot.forEach((doc) => {
      receivedRequests.push(doc.data());
    });

    const allRequests = [...sentRequests, ...receivedRequests];
    setRequests(allRequests);

  }

  useEffect( () => {
   getData()
  }, []);

  const AcceptRequest = async (index) => {
    await store
      .collection("Request")
      .doc(requests[index]["Request_id"])
      .update({
        Request_status: "accept",
      })
      .then(async () => {
        console.log("Accept Request Successfully");

        var key = db.ref("Firends").push().getKey();

        await store.collection("conversions").doc(key).set({
          senderId: requests[index]["senderId"],
          recieverId: requests[index]["recieverId"],
          conversionId: key,
          senderuserName: requests[index]["senderuserName"],
          senderemail: requests[index]["senderemail"],
          RecieveruserName: requests[index]["RecieveruserName"],
          Recieveremail: requests[index]["Recieveremail"],
        });
        const updatedrequests = requests.filter((_, i) => i !== index);
        setRequests(updatedrequests);
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  return (
    <>
    <div style={{display:"flex",justifyContent:"space-around"}}>
    <Link to={"/user"}>User List  Page</Link>
    <Link to={"/Request"}>Request</Link>
    <Link to={"/ChatList"}>Friend List  Page</Link>


    {/* <button onClick={()=>nav("/Request")}>
    Request
    </button>
    <button onClick={()=>nav("/user")}>
    User   
    </button>
    <button onClick={()=>nav("/MessageScreen")}>
    message
        </button> */}

    </div>
    
      <h1 style={{ textAlign: "center" }}>List of Request</h1>
      {requests.map((val, index) => (
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
            {val.senderId == currentUserId ? (
              <h1>{val.Request_status}</h1>
            ) : (
              val.senderId != currentUserId && val.Request_status != "pending"   ?
              <h1>{val.Request_status}</h1>
              :
              <button onClick={() => AcceptRequest(index)}>Accept</button>

            )}
          </div>
        </div>
        
      ))}
    </>
  );
}
export default RequestList;
