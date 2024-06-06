import { useEffect, useState } from "react"
import { db, store } from "../../Config/firebase";

function FirendList(){

    const [user, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);
    const currentUserId = "QROyEo9JhbUF4PI8bfLDr4rhAeA2"; // The current user's ID

    

    useEffect(async ()=>{
        var data =[];
        store.collection("users").where("userId" , "!=",currentUserId ).get().then((querySnapshot) => {
           
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                data.push(doc.data())
                
            });
          
        });
          // Fetch friend requests where current user is either the sender or the receiver
          const sentRequestsSnapshot = await store.collection("Request")
          .where("sendId", "==", currentUserId)
          .get();

      const sentRequests = [];
      sentRequestsSnapshot.forEach((doc) => {
          sentRequests.push(doc.data());
      });

      const receivedRequestsSnapshot = await store.collection("Request")
          .where("recieverId", "==", currentUserId)
          .get();

      const receivedRequests = [];
      receivedRequestsSnapshot.forEach((doc) => {
          receivedRequests.push(doc.data());
      });

      const allRequests = [...sentRequests, ...receivedRequests];
      setRequests(allRequests);

      // Filter out users who have an existing request with the current user
      const filteredUsers = data.filter(user => {
          return !allRequests.some(
              request => 
                  (request.sendId === currentUserId && request.recieverId === user.userId) || 
                  (request.sendId === user.userId && request.recieverId === currentUserId)
          );
      });

      setUsers(filteredUsers);

    },[])

    const sendRequest=async (index)=>{

      var key =  db.ref("Request").push().getKey();
      console.log(key)

        var obj = {
            "sendId":currentUserId ,
            "recieverId" : user[index]["userId"],
            "Request_status" : "pending",
            "Request_id" : key,
            "senderuserName" : "sender",
            "senderemail":"sender email",
            "RecieveruserName" : user[index]["name"],
            "Recieveremail":user[index]["email"]

        }

        await  store.collection("Request").doc(key).set(obj)
        .then(() => {
            console.log("Request Send Successfully");
            const updatedUsers = user.filter((_, i) => i !== index);
            setUsers(updatedUsers);
           
          
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
     




    }

    return(
        <>
        <h1 style={{textAlign:"center"}}>List of Users</h1>
        {user.map((val, index) => (
                <div
                    key={index}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        margin:"40px"
                    }}
                >
                    <div>
                        <div><strong>ID:</strong> {val.userId}</div>
                        <div><strong>Name:</strong> {val.name}</div>
                        <div><strong>Email:</strong> {val.email}</div>
                    </div>
                    <div>
                        <button onClick={()=>sendRequest(index)}>Send Request</button>
                    </div>
                </div>
            ))}
        </>
    )
}
export default FirendList