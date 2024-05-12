
import React, { useState } from "react";
import { Stepper, Step, StepLabel, Typography } from "@mui/material";
import Form1 from "./Form/Form1";
import Form2 from "./Form/Form2";
import Form3 from "./Form/Form3";

//fujction chnage form 
function getStepContent(activeStep,handlenext,handleback){
   
    switch(activeStep){
        case 0:
            return <Form1 handlenext={handlenext}/>
        case 1:
            return <Form2 handlenext={handlenext} handleback={handleback}/>
        case 2:
            return <Form3 handleback={handleback}/>
    }


}

function StepperForm() {
    const [activestep, setactivestep] = useState(0)
    const stepsData = [
        "Personal Information",
        "Education Information",
        "General Information"
    ]

    const handlenext=()=>{
        setactivestep(activestep+1)
    }
    const handleback=()=>{
        setactivestep(activestep-1)
    }
    return (
        <div>
            <Stepper activeStep={activestep} alternativeLabel>
                {
                    stepsData.map((v, i) => {
                        return (
                            <Step >
                                <StepLabel>{v}</StepLabel>
                            </Step>
                        )

                    })
                }

            </Stepper>
            {
                activestep == stepsData.length ?
                    "Submit" :
                    <Typography>{getStepContent(activestep,handlenext,handleback)}</Typography>
            }
        </div>
    )

}

export default StepperForm