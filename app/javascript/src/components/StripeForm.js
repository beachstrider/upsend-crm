import React, { useMemo } from "react";
import { useEffect, useState } from "react";
import Typography from '@material-ui/core/Typography';
import ActionTypes from '../constants/action_types';
import Link from '@material-ui/core/Button';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement
} from "@stripe/react-stripe-js";

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box'; 
import TextField from '@material-ui/core/TextField'; 
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Progress from '../shared/Progress'
import Button from '@material-ui/core/Button';
import "../themes/StripeForm" 

import {
  UPGRADE_PLAN_PAYMENT
} from '../graphql/mutations' 

import graphql from '../graphql/client'
import {errorMessage, successMessage} from '../actions/status_messages'
const useOptions = () => {
  const fontSize = useResponsiveFontSize();
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: "#424770",
          letterSpacing: "0.025em",
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
            color: "#aab7c4"
          }
        },
        invalid: {
          color: "#9e2146"
        }
      }
    }),
    [fontSize]
  );

  return options;
};

const BillingForm = ({app, selectedPlan, dispatch,billingInfo}) => { 
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions(); 
  const [firstName, setFirstName] = React.useState(billingInfo.first_name);
  const [lastName, setLastName] = React.useState(billingInfo.last_name);
  const [email, setEmail] = React.useState(billingInfo.email);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [cardToken, setCardToken] = React.useState('');
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [addNewCard, setAddNewCard] = useState(false);
  const [newPlan, setNewPlan] = useState({});

  function getApp(app) {
    return {
      type: ActionTypes.GetApp,
      data: app
    } 
  }

  function submitCard(token){ 
    setLoading(true); 

    graphql(UPGRADE_PLAN_PAYMENT, {
      appKey: app.key, 
      token: token,  
      plan: selectedPlan.id,
      billingParams: {first_name: firstName, last_name: lastName, email: email}
    }, {
      success: (data)=>{
        console.log("success data",data);
        setLoading(false);  
        const plan = data.createSubscription.plan
        const errors = data.createSubscription.errors
         
        if(errors) {
          console.log("errors", errors); 
          setErrorMessage(errors)
          return
        } 
        setNewPlan(plan);
        setPaymentSucceeded(true);
        const message = "Plan updated successfully" 
        dispatch(successMessage(message))  

        if(data.createSubscription.app){
          const newObject = Object.assign({}, data.createSubscription.app, {errors: {} })
          dispatch(getApp(newObject)) 
        }
      },
      error: (data)=>{ 
        console.log("error data",data);

        setLoading(false);
          
      }
    })
  }


  const handleSubmit = async event => {

    setLoading(true);
    setErrorMessage('')
    event.preventDefault();  
    if(selectedPlan.amount == 0){
      submitCard('');
    }else{ 
      if (!stripe || !elements) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        return;
      }

      const payload = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardNumberElement)
      });
      console.log("[PaymentMethod]", payload);
      if(payload.error){
        setLoading(false);
        setErrorMessage(payload.error.message);
      }else{
        setLoading(false);
        console.log(payload.paymentMethod)
        console.log(payload.paymentMethod.id)
        var id = payload.paymentMethod.id;
        setCardToken(id);  
        submitCard(id);
      }
    }
  };

  return (
    <React.Fragment>
        {!paymentSucceeded && <Box>
          <Typography component="h1" variant="h6">
            Billing Details 
          </Typography>
          <br/>
          <Grid container spacing={2} md={9}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus  
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Grid> 
          </Grid>

          <br/>

            {
              billingInfo && billingInfo.stripe_card_id && !addNewCard && <Box> 
                <Typography component="h1" variant="h6" align="left" > 
                  Use {billingInfo.brand} ending in {billingInfo.last4} or 
                </Typography> 
                <Button component={Link} color="secondary" onClick={(e) => setAddNewCard(true)}  > Click here to Add New Card </Button>
                <br/>
                <br/>
                <Typography variant="h6" color={"error"}>{errorMessage}</Typography>
                  {loading && <Progress />}
                  {!loading && <Button disabled={loading} onClick={(e) => submitCard(billingInfo.stripe_card_id)} className="stripeEle" color={'secondary'}>
                    SUBMIT PAYMENT
                  </Button>
                  } 

              </Box>
            }

            {
              (selectedPlan.amount > 0) && (addNewCard || !billingInfo.stripe_card_id) && <Box>
                <Box mt={5}>
                 <Typography component="h1" variant="h6" align="left" > 
                  Payment Details 
                  {billingInfo.stripe_card_id && <Button component={Link} color="secondary" align="right" onClick={(e) => setAddNewCard(false)} > Click here to use existing Card </Button>}
 
                 </Typography>
                 </Box> 
                 <br/>    
                 

                <form onSubmit={handleSubmit}>
                  <label>
                    Card number
                    <CardNumberElement
                      options={options}
                      onReady={() => {
                        console.log("CardNumberElement [ready]");
                      }}
                      onChange={event => {
                        console.log("CardNumberElement [change]", event);
                      }}
                      onBlur={() => {
                        console.log("CardNumberElement [blur]");
                      }}
                      onFocus={() => {
                        console.log("CardNumberElement [focus]");
                      }}
                    />
                  </label>
                  <label>
                    Expiration date
                    <CardExpiryElement
                      options={options}
                      onReady={() => {
                        console.log("CardNumberElement [ready]");
                      }}
                      onChange={event => {
                        console.log("CardNumberElement [change]", event);
                      }}
                      onBlur={() => {
                        console.log("CardNumberElement [blur]");
                      }}
                      onFocus={() => {
                        console.log("CardNumberElement [focus]");
                      }}
                    />
                  </label>
                  <label>
                    CVC
                    <CardCvcElement
                      options={options}
                      onReady={() => {
                        console.log("CardNumberElement [ready]");
                      }}
                      onChange={event => {
                        console.log("CardNumberElement [change]", event);
                      }}
                      onBlur={() => {
                        console.log("CardNumberElement [blur]");
                      }}
                      onFocus={() => {
                        console.log("CardNumberElement [focus]");
                      }}
                    />
                  </label>

                  <Typography variant="h6" color={"error"}>{errorMessage}</Typography>
                  {loading && <Progress />}
                  {!loading && <button type="submit" disabled={!stripe} className="stripeEle">
                    Pay
                  </button>
                  }

                </form>
                </Box>
              }


              {(selectedPlan.amount == 0) && <Box>
                <Box mt={5}>
                 <Typography component="h1" variant="h6" align="left" > 
                  Payment Details
                 </Typography>
                 </Box> 
                 <br/>   
                <form onSubmit={handleSubmit}>
                  <label> 
                  </label> 

                  <Typography variant="h6" color={"error"}>{errorMessage}</Typography>
                  {loading && <Progress />}
                  {!loading && <button type="submit" className="stripeEle">
                    Downgrade to free plan
                  </button>
                  }
                </form>
                </Box>
              }

            </Box>   
          
          
        
      }
      {paymentSucceeded && <ThankYou  newPlan={newPlan} />}
    </React.Fragment>
  );
};

export default BillingForm;



const ThankYou = ({newPlan}) => { 
  return (
    <React.Fragment> 
        <Typography component="h1" variant="h4" align="center">
          Plan change request has been completed successfully. Below are the details of your new plan. 
          
        </Typography>
        <br/>
        <Typography component="h1" variant="h6" align="center">
          Current Plan: {newPlan.category} ({newPlan.contacts} contacts, seats: {newPlan.seats}) 
        </Typography>
    </React.Fragment>
  );
};


export function useResponsiveFontSize() {
  const getFontSize = () => (window.innerWidth < 450 ? "16px" : "18px");
  const [fontSize, setFontSize] = useState(getFontSize);

  useEffect(() => {
    const onResize = () => {
      setFontSize(getFontSize());
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  return fontSize;
}
