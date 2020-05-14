import React, {
  useState, 
  useEffect, 
  useRef
} from 'react'


import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/StarBorder';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box'; 
import Slider from '@material-ui/core/Slider'; 
import ButtonBase from '@material-ui/core/ButtonBase';
import { withStyles } from '@material-ui/core/styles';


import TextField from '@material-ui/core/TextField'; 
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Progress from '../shared/Progress'
import {errorMessage, successMessage} from '../actions/status_messages'
import { setCurrentPage, setCurrentSection } from "../actions/navigation";

import graphql from '../graphql/client'
import {
  AVAILABLE_PLANS
} from '../graphql/queries'
// import {
//   SES_IDENTITY_CREATE,
//   SES_IDENTITY_UPDATE,
//   SES_IDENTITY_DELETE
// } from '../graphql/mutations'  
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import serialize from 'form-serialize'

import BillingForm from "../components/StripeForm"


import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
//import dotenv from  'dotenv'

function PlanPayment({app, dispatch, selectedPlan, billingInfo}){  
  



const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);

 // useEffect(()=>{
 //    dispatch(setCurrentSection("Settings"))
 //    dispatch(setCurrentPage("pricing")) 
 //    fetchPlans()
 //  }, [])
 
   
  //const [selectedPlan, setSelectedPlan] = React.useState({}); 
  const [plans, setPlans] = useState([])
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = useState(false)
  const useStyles = makeStyles(theme => ({
    '@global': {
      body: {
        backgroundColor: theme.palette.common.white,
      },
      ul: {
        margin: 0,
        padding: 0,
      },
      li: {
        listStyle: 'none',
      },
    },
    appBar: {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbar: {
      flexWrap: 'wrap',
    },
    toolbarTitle: {
      flexGrow: 1,
      color: 'black'
    },
    link: {
      margin: theme.spacing(1, 1.5),
    },
    heroContent: {
      padding: theme.spacing(2, 0, 3),
    },
    cardHeader: { 
      borderBottom: '1px solid lightgrey'
    },
    cardPricing: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'baseline',
      marginBottom: theme.spacing(2),
    },
    cardSelected:{
      border:'2px solid #FFB600',
      background: 'rgba(255,182,0,.1)'
    },
    footer: {
      borderTop: `1px solid ${theme.palette.divider}`,
      marginTop: theme.spacing(8),
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      [theme.breakpoints.up('sm')]: {
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(6),
      },
    }, 
    sliderContainer: {
      borderTop: `1px solid ${theme.palette.divider}`,
      marginTop: theme.spacing(8),
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(1),
      },
    }, 
    paymentSummaryHeader: {
      backgroundColor: '#efeeeb',
    },
    root: {
      height: 120,
      width: '100%',
    },
    slider: {
      position: 'relative',
      width: '100%',
      minHeight: '10px'
    },
  })); 
   
 
  const summary = {
    title: 'Payment Summary',
    price: '30',
    description: [
      'Plan ', 
      'Details' 
    ],
    buttonText: 'UPGRADE',
    buttonVariant: 'contained',
  }

   
 
  
  const classes = useStyles();
 


  function fetchPlans(){
    setLoading(true) 
    setPlans([]);
    console.log(" app.key ",  app.key );
    setSelectedPlan(app.plan)
    graphql(AVAILABLE_PLANS, { appKey: app.key  }, {
      success: (data)=>{ 
        console.log(data);
        setLoading(false);  
        var pps = data.app.availablePlanCategories; 
        setPlans(data.app.availablePlanCategories); 
        let params = new URLSearchParams(window.location.search);
        let pid = params.get('p'); 
        var p = pps.filter((o)=> parseInt(o.id) === parseInt(pid) )
       
        if(p){
          setSelectedPlan(p[0])
        }

        //findPlan(); 
      }, 
      error: (data)=>{
        setLoading(false); 
        console.log("error data", data);
        
      }
    })
  }

  function findPlan(){  
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let pid = params.get('p');
    console.log('pid', plans);
    var p = plans.filter((o)=> parseInt(o.id) === parseInt(pid) )
    console.log("ppp", p);
    if(p)
      setSelectedPlan(p[0])
  }

 
 

  return (
    <React.Fragment>
      <CssBaseline />
   

      <Container spacing={1} maxWidth="lg" component="main" className={classes.heroContent} >
         <Typography component="h3" variant="h6" align="center" color="textPrimary"   >
           {loading && <Progress/>}
          </Typography>  
      </Container> 

      <Container maxWidth="lg" component="main">
      <Grid container alignItems="flex-start">
        <Grid item xs={12} md={9} >
              
          <Box> 
            <Elements stripe={stripePromise}>
              <BillingForm app={app} selectedPlan={selectedPlan} dispatch={dispatch} billingInfo={billingInfo} />
            </Elements>
          </Box>
 
  

        </Grid>
        <Grid item xs={12} md={3} >
             
          {selectedPlan && <Grid container  alignItems="flex-start"> 
            <Grid item key={summary.title} xs={12}  md={12}>
              <Card >
                <CardHeader
                  title={summary.title}
                  subheader={summary.subheader}
                  titleTypographyProps={{ align: 'left' }}
                  subheaderTypographyProps={{ align: 'left' }}
                  action={summary.title === 'Pro' ? <StarIcon /> : null}
                  className={classes.paymentSummaryHeader}
                /> 
                  <CardContent>
                    <div className={classes.cardPricing}>
                      <Typography component="h2" variant="h3" color="textPrimary">
                        ${selectedPlan.amount}
                      </Typography>
                      <Typography variant="h6" color="textSecondary">
                        /month
                      </Typography>
                    </div>
                    <ul>                       
                      <Typography component="li" variant="subtitle1" align="left">
                        Plan: {selectedPlan.category}
                      </Typography> 
                      <Typography component="li" variant="subtitle1" align="left">
                        Contacts: {selectedPlan.contacts}
                      </Typography> 
                      <hr/>
                      {
                        selectedPlan.additionalPrice > 0 && <hr/> && <Typography component="li" variant="subtitle1" align="left">
                        *When you exceed your limit, you incur additional charges of {selectedPlan.additionalPrice}/mo per additional {selectedPlan.additionalContacts} contacts.
                      </Typography> 
                      }
                      
                      

                    </ul>
                    

                  </CardContent> 
              </Card>
            </Grid>
          </Grid>   
          }
        </Grid>
      </Grid>  
      </Container>

    </React.Fragment>
  );
}


function mapStateToProps(state) {
  const { app } = state 
  return {
    app,
  }
}


export default withRouter(connect(mapStateToProps)(PlanPayment))
