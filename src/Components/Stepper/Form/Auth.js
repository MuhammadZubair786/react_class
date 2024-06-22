import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { auth, db, store } from "../../../Config/firebase";
import firebase from "../../../Config/firebase";
import { Link,useNavigate } from "react-router-dom";

function Auth() {
  var [email, setemail] = useState();
  var [password, setpassword] = useState();
  var [name, setname] = useState();


  const nav = useNavigate()

  const LoginAccount = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        // Signed in
        var user = userCredential.user;
        var docRef = store.collection("users").doc(user.uid);

        docRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              console.log("Document data:", doc.data());
              localStorage.setItem("userName",doc.data()["name"])
              localStorage.setItem("userId",doc.data()["userId"])
              localStorage.setItem("userEmail",doc.data()["email"])
              nav("/user")

            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      
        toast("account login", {
          position: "top-center",
          autoClose: 5018,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        toast(errorMessage);

        // ..
      });
  };
  const createAccount = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        // Signed in
        var user = userCredential.user;

        var obj = {
          name: name,
          email: email,
          password: password,
          userId: user.uid,
        };

        //  await  db.ref('users/' + user.uid).set(obj);

        await store
          .collection("users")
          .doc(user.uid)
          .set(obj)
          .then(() => {
            console.log("Document successfully written!");
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });

        console.log(user);
        toast("account create", {
          position: "top-center",
          autoClose: 5018,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        toast(errorMessage);

        // ..
      });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <ToastContainer
        position="top-center"
        autoClose={5018}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <h1>Create And Login User Page</h1>
      <br />
      <input
        type="text"
        value={name}
        onChange={(e) => setname(e.target.value)}
      />
      <br />
      <input
        type="email"
        value={email}
        onChange={(e) => setemail(e.target.value)}
      />
      <br />
      <input
        type="text"
        value={password}
        onChange={(e) => setpassword(e.target.value)}
      />
      <br />
      <button onClick={()=>createAccount() }>Create Account</button>
      <br />
      <button onClick={()=>LoginAccount()}>Login</button>
      <Link to="/user">User</Link>
      

    </div>
  );
}

export default Auth