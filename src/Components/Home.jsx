import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
function Home() {
    var [email, setEmail] = useState()
    var [show, setShow] = useState(false)

    useEffect(() => {
        if(show==true){
            setTimeout(() => {
                setShow(false)
            }, 1000)

        }
          

    }, [show])


    return (
        <>
            <h1>
                mui
            </h1>
            <Button variant="contained" className='new1' sx={{ color: "white" }}
                onClick={() => setShow(true)}
            >Contained</Button>
            <br />
            <TextField
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
                id="standard-basic" label="Standard" variant="standard" className='text' sx={{ "&hover": "red", }} />

            {
                show ?
                    <h1>{email}</h1>
                    :
                    null
            }

        </>


    )
}
export default Home