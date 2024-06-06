import { useEffect, useState } from "react"
import { db, store } from "../../Config/firebase";

function RequestList(){

    const [requests, setRequests] = useState([]);
    const currentUserId = "5PW36Git9RZsbQJwaM4I7my2lri2"; // The current user's ID

    

    useEffect(async ()=>{
        var data =[];
     
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


    },[])

    const AcceptRequest=async(index)=>{


        await  store.collection("Request").doc(requests[index]["Request_id"]).update({
            Request_status: "accept"
        })
        .then(async () => {
            console.log("Accept Request Successfully");

            var key =  db.ref("Firends").push().getKey();


          await  store.collection("conversions").doc(key).set({
                "senderId":requests[index]["sendId"],
                "recieverId" : requests[index]["recieverId"],
                "conversionId":key,
                "senderuserName" : requests[index]["senderuserName"],
                "senderemail":requests[index]["senderemail"],
                "RecieveruserName" : requests[index]["RecieveruserName"],
                "Recieveremail":requests[index]["Recieveremail"]
            })
            const updatedrequests = requests.filter((_, i) => i !== index);
            setRequests(updatedrequests);
           
          
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });



    }

   
    return(
        <>
        <h1 style={{textAlign:"center"}}>List of Request</h1>
        {requests.map((val, index) => (
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
                        {/* <div><strong>ID:</strong> {val.userId}</div> */}
                        <div><strong>Name:</strong> { val.sendId == currentUserId  ? val.RecieveruserName : val.senderuserName}</div>
                        <div><strong>Email:</strong> { val.sendId == currentUserId  ? val.Recieveremail : val.senderemail}</div>
                    </div>
                    <div>
                    { val.sendId == currentUserId  ?
                    <h1>{ val.Request_status }</h1>
                   :  <button onClick={()=>AcceptRequest(index)}>Accept</button> }
                   
                    </div>
                </div>
            ))}
        </>
    )
}
export default RequestList