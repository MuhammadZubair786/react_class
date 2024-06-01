import React from "react";
import { Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup'
import TextField from '@mui/material/TextField';
import { auth } from "../../../Config/firebase";
import firebase from "../../../Config/firebase";
import { ToastContainer, toast } from 'react-toastify';

function Form1(props) {
    console.log(props)

    const signout=()=>{
        firebase.auth().signOut().then(() => {
            toast("account log out")
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          });
    }

    const googleSignin =async () => {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase
        .auth()
        .signInWithPopup(provider)
            .then((result) => {

                var credential = result.credential;
                var token = credential.accessToken;
                var user = result.user;
                console.log(user)

            }).catch((error) => {

                var errorCode = error.code;
                var errorMessage = error.message;

                var email = error.email;

                var credential = error.credential;
                console.log(error)

            });
    }


    const createAccount = (email, password) => {

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                console.log(user)
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
                console.log(errorMessage)
                toast(errorMessage);

                // ..
            });


    }

    return (
        <>
            <div style={{ width: 600 + "px", margin: "auto" }}>
                <h1>Form 1</h1>
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

                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={Yup.object({
                        password: Yup.string().min(5, "Enter Must Name greater then 5 ").max(10, "only enter less then 10 letter")
                            .required("FILED REQUIRED"),
                        email: Yup.string().email("Invalid Email").required("M,essage")
                    })}
                    onSubmit={(value) => {
                        console.log(value.email, value.password)
                        createAccount(value.email, value.password)
                    }}
                >
                    {props => (
                        <form onSubmit={props.handleSubmit}>
                            <TextField id="outlined-basic" label="Outlined" variant="outlined"
                                value={props.values.email}
                                onChange={props.handleChange}
                                name="email"
                            />
                            <ErrorMessage name="email" />
                            <TextField id="outlined-basic" label="Outlined" variant="outlined"
                                value={props.values.password}
                                onChange={props.handleChange}
                                name="password"
                            />
                            <ErrorMessage name="password" />

                            <button type="submit">Submit</button>

                        </form>

                    )}


                </Formik>
                <button onClick={()=>signout()}>Google signout</button>
           
                <button onClick={()=>googleSignin()}>Google signin</button>





                <Button variant="contained" className='new1' sx={{ color: "white" }}
                    onClick={() => props.handlenext()}
                >Next</Button>


            </div>
        </>


    )
}
export default Form1