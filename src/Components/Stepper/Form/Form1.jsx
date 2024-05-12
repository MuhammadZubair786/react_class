import React from "react";
import { Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup'
import TextField from '@mui/material/TextField';

function Form1(props) {
    console.log(props)


    return (
        <>
            <div style={{ width: 600 + "px", margin: "auto" }}>
                <h1>Form 1</h1>

                <Formik
                    initialValues={{ firstName: "", email: "" }}
                    validationSchema={Yup.object({
                        firstName: Yup.string().min(5, "Enter Must Name greater then 5 ").max(10, "only enter less then 10 letter")
                            .required("FILED REQUIRED"),
                        email: Yup.string().email("Invalid Email").required("M,essage")
                    })}
                    onSubmit={(value) => {
                        console.log("ok")
                    }}
                >
                    {props => (
                        <form onSubmit={props.handleSubmit}>
                            <Field placeholder="test" type="text" name="firstName" />
                            <TextField id="outlined-basic" label="Outlined" variant="outlined"
                                value={props.values.firstName}
                                onChange={props.handleChange}
                                name="firstName"
                            />
                            <ErrorMessage name="firstName" />

                            <button type="submit">Submit</button>

                        </form>

                    )}


                </Formik>




                <Button variant="contained" className='new1' sx={{ color: "white" }}
                    onClick={() => props.handlenext()}
                >Next</Button>


            </div>
        </>


    )
}
export default Form1