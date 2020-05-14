
import React, {useState} from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import graphql from '../graphql/client'

import {errorMessage, successMessage} from '../actions/status_messages'
import {isEmpty} from 'lodash'
import { UPDATE_ACCOUNT_DETAILS } from '../graphql/mutations'

const useStyles = makeStyles(theme => ({
  /*'@global': {
    body: {
      backgroundColor: theme.palette.common.black,
    },
  },*/
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: 'transparent',
    width: '348px',
    height: '96px',
    borderRadius: '0%'
  },
  logo: {
    height: '100%',
    width: '100%'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
}));

function UpdatePassword({ app, dispatch }){
  const classes = useStyles();
  const [currentPassword, setCurrentPassword] = useState(null);
  const [password, setPassword] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);

  const handleSubmit = (e)=>{
    e.preventDefault();
    if(currentPassword.length > 0){
      const options = {}
      options["password"] = password
      options["current_password"] = currentPassword
      graphql(UPDATE_ACCOUNT_DETAILS, {
        appKey: app.key, 
        options: options
      }, {
        success: (data)=>{
          if(isEmpty(data.updateAccountDetails.errors)){
            setPassword('');
            setCurrentPassword('');
            dispatch(successMessage("Password Changed"))
          }
          else{
            dispatch(errorMessage("Can not change Password, Please check details again"))
          }
        },
        error: (error)=>{
          console.log("ERRR Updating app", error)
        }
      })
    }
  }

  const handleCurrentPasswordChange = (e)=>{
    if(e.target.value.length > 0){
      setIsDisabled(false)
    }
    else{
      setIsDisabled(true)
    }
    setCurrentPassword(e.target.value)
  }

  return (
    <React.Fragment>
      <Container spacing={1} maxWidth="lg" component="main" >
        <div className={classes.paper}>
          <h1>Change Password</h1>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid item sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="password"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                  />
                </Grid>
              </Grid>  
              <Grid item xs={12}>
                <Grid item sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="currentPassword"
                    label="Current Password"
                    type="password"
                    id="currentPassword"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={handleCurrentPasswordChange}
                  />
                </Grid>
              </Grid>  
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isDisabled}
            >
              Change Password
            </Button>
          </form>
        </div>
      </Container>
    </React.Fragment>
  )
}


function mapStateToProps(state) {
  const { app } = state 
  return {
    app,
  }
}


export default withRouter(connect(mapStateToProps)(UpdatePassword))