import React from "react";
import { Button } from "@mui/material";

function Form2(props){
    return(
        <>
         <div style={{width:600+"px",margin:"auto"}}>
          <h1>Form 2</h1>
          <Button variant="contained" className='new1' sx={{ color: "white" }}
                onClick={()=>props.handleback()}
            >Back</Button>
              <Button variant="contained" className='new1' sx={{ color: "white" }}
                onClick={()=>props.handlenext()}
            >Next</Button>
        </div>
        </>

      
    )
}
export default Form2