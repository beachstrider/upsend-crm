import React , {useState} from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import Button from '@material-ui/core/Button'


export default function EmailForwarding({settings, update}){
  const [value, setValue] = useState(settings.key)

  function handleChange(e){
    setValue(e.target.value)
  }

  function handleSubmit(){
    const data = {
      app: {
        email_requirement: value
      }
    } 
    update(data)
  }

  return (

      <Box mb={2}>
        <Typography variant={"h4"}>
          Email forwarding for {settings.name}
        </Typography>
        <br/>
        <Typography variant={"body1"} color={'secondary'}>
          Default inbound address  
        </Typography> 

        <Typography variant={"h6"}> 
          {settings.emailForwardingAddress}
        </Typography> 

        <Typography variant={"body1"} color={'secondary'}>
          Forward email from your normal support email address (such as help@myapp.com) to Upsend so you can reply to emails from your inbox .
        </Typography> 

    </Box>


  )
}