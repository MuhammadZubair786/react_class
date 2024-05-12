import { Button } from "@mui/material";
import React from "react";

function Form3(props){
    return(
        <>
         <div style={{width:600+"px",margin:"auto"}}>
           <h1>Form 3</h1>
           <Button variant="contained" className='new1' sx={{ color: "white" }}
                onClick={()=>props.handleback()}
            >Back</Button>
       
        </div>
        </>
     
    )
}
export default Form3