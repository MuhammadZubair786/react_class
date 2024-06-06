import { useEffect, useState } from "react"
import { db, store } from "../../Config/firebase";

function ChatList(){

    const [user, setUsers] = useState([]);
    const [chatList, setchatList] = useState([]);
    const currentUserId = "QROyEo9JhbUF4PI8bfLDr4rhAeA2"; // The current user's ID

    

    useEffect(async ()=>{
        var data =[];
        const query1 = store.collection("conversions").where("senderId", "==", currentUserId);

        // Query to get users where status is equal to "active"
        const query2 = store.collection("conversions").where("recieverId", "==", currentUserId);
        
        // Execute both queries
        Promise.all([query1.get(), query2.get()]).then((results) => {
          const allDocs = [];
        
          results.forEach((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // Merge results, avoiding duplicates
              if (!allDocs.some(existingDoc => existingDoc.id === doc.id)) {
                allDocs.push(doc);
              }
            });
          });
        
          // Process the merged results
          allDocs.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            data.push(doc.data())
          });
          setchatList(data)
        }).catch((error) => {
          console.log("Error getting documents: ", error);
        });
        

      setUsers(data);

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
        <h1 style={{textAlign:"center"}}>Chat Users</h1>
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
                        {/* <div><strong>ID:</strong> {val.userId}</div> */}
                        <div><strong>Name:</strong> { val.senderId == currentUserId  ? val.RecieveruserName : val.senderuserName}</div>
                        <div><strong>Email:</strong> { val.senderId == currentUserId  ? val.Recieveremail : val.senderemail}</div>
                    </div>
                    <div>
                    <button>Chat</button> 
                   
                    </div>
                </div>
            ))}
        </>
    )
}
export default ChatList