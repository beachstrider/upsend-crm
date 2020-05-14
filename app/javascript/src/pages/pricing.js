import React, {
  useState, 
  useEffect, 
  useRef
} from 'react'

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/StarBorder';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography'; 
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box'; 
import Slider from '@material-ui/core/Slider'; 
import ButtonBase from '@material-ui/core/ButtonBase';
import { withStyles } from '@material-ui/core/styles'; 
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';


import Progress from '../shared/Progress'
import {errorMessage, successMessage} from '../actions/status_messages'
import { setCurrentPage, setCurrentSection } from "../actions/navigation";

import graphql from '../graphql/client'
import {
  AVAILABLE_PLANS,
  BILLING_INFO
} from '../graphql/queries'
// import {
//   SES_IDENTITY_CREATE,
//   SES_IDENTITY_UPDATE,
//   SES_IDENTITY_DELETE
// } from '../graphql/mutations'  
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import serialize from 'form-serialize'

import SplitForm from "../components/StripeForm"


import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PlanPayment from "./payment"
//import dotenv from  'dotenv'



function Pricing({app, dispatch}){  
 
 


   useEffect(()=>{
      dispatch(setCurrentSection("Settings"))
      dispatch(setCurrentPage("pricing")) 
      fetchPlans()
      fetchBilling()
    }, [])
   
  const [existingPlan, setExistingPlan] = React.useState({});
  const [selectedPlan, setSelectedPlan] = React.useState({}); 
  const [planCategories, setPlanCategories] = useState([])
  const [plans, setPlans] = useState([])
  const [value, setValue] = React.useState(1);
  const [loading, setLoading] = useState(false);
  const [viewBilling, setViewBilling] = useState(false);
  const [billingInfo, setBillingInfo] = useState({first_name:'', last_name:'', email:''});
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
  //const tiers = [];
  // const tiers = [
  //   {
  //     title: 'Premium',
  //     price: '30',
  //     description: [
  //       'Advanced features for pros who need more customization.'
  //     ],
  //     buttonText: 'Contact us',
  //     buttonVariant: 'outlined',
  //   }, 
  //   {
  //     title: 'Standard', 
  //     price: '15',
  //     description: [
  //       'Better insights for growing businesses that want more customers.'
  //     ],
  //     buttonText: 'Get started',
  //     buttonVariant: 'outlined',
  //   }, 
  //   {
  //     title: 'Free',
  //     price: '0',
  //     description: ['All the basics for businesses that are just getting started.'],
  //     buttonText: 'Sign up for free',
  //     buttonVariant: 'outlined',
  //   },
  // ];

  const freeDescriptions = ['All the basics for businesses that are just getting started.'];
  const standardDescriptions = ['Better insights for growing businesses that want more customers.'];
  const premiumDescriptions = ['Advanced features for pros who need more customization..'];


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

  const footers = [
    {
      title: 'Everything in Standard, plus',
      description: ['Advanced segmentation', 'Advanced audience insights', 'Maximum 6 seats', 'Phone support'],
    },
    {
      title: 'Everything in Free, plus',
      description: ['Advanced audience insights', 'Maximum 3 seats'],
    }, 
    {
      title: 'Free Plan',
      description: [ 'Maximum 1 seats', 'Upto 2000 contacts'],
    },
  ];

  //const domain = [500, 2500, 5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000]
  // const marks = [
  //   {
  //     value: 0, label: '500',
  //   },
  //   {
  //     value: 1, label: '',
  //   },
  //   {
  //     value: 2, label: '5k',
  //   },
  //   {
  //     value: 3,  label: '',
  //   },
  //   {
  //     value: 4,  label: '15k',
  //   },
  //   {
  //     value: 5,  label: '',
  //   },
  //   {
  //     value: 6,  label: '25k',
  //   },
  //   {
  //     value: 7,  label: '',
  //   },
  //   {
  //     value: 8,  label: '40k',
  //   },      
  //   {
  //     value: 9,  label: '',
  //   },
  //   {
  //     value: 10,  label: '75k',
  //   },
  //   {
  //     value: 11,  label: '',
  //   }     
  // ];

  // function valueLabelFormat(value) { 
  //    const obj = marks.filter(
  //           (o)=> o.value == value
  //         ) 
  //   return obj[0].label; 
  // }
  // const handleChange = (event, newValue) => {
      
  //     //setValue(newValue);
  //   };

  const PrettoSlider = withStyles({
    root: {
      color: '#FFB600',
      height: 8,
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -8,
      marginLeft: -12,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
    },
    track: {
      height: 8,
      borderRadius: 4,
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
  })(Slider);




  const sliderPlanChange = (event, newValue) => {
    console.log("handleChange invoked", event);
    console.log("handleChange invoked", newValue);
    var plan;
    if(selectedPlan.category.toLowerCase() == "standard"){
      plan = allStandardPlans()[newValue];
    }else if(selectedPlan.category.toLowerCase() == "premium"){
      plan = allPremiumPlans()[newValue];
    }
    if(plan)
      setSelectedPlan(plan)
  };

  const classes = useStyles();
// const state = {
//    values: defaultValues.slice(),
//    update: defaultValues.slice(),
//  }
  
  function kFormatter(num) {
      return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
  }

  function planChanged(plan){ 
    setSelectedPlan(plan);
  }

  

  function onUpdate(update){
    console.log("update", update);
    //this.setState({ update })
  }

  function onChange(values){
    console.log("onChange", values);
    //this.setState({ values })
  }

  function valuetext(value) {
    return `${value}°C`;
  }


  function fetchPlans(){
    setLoading(true) 
    setPlans([]); 
    setSelectedPlan(app.plan);
    setExistingPlan(app.plan);
    graphql(AVAILABLE_PLANS, { appKey: app.key  }, {
      success: (data)=>{ 
        setLoading(false);  
        console.log(data.app.availablePlanCategories ); 
        setPlans(data.app.availablePlanCategories );
      }, 
      error: (data)=>{
        setLoading(false); 
        console.log("error data", data);
        
      }
    })
  }



  function fetchBilling(){
    setLoading(true) 
    setBillingInfo([]);  
    graphql(BILLING_INFO, { appKey: app.key  }, {
      success: (data)=>{ 
        setLoading(false);  
        console.log("billing",data.app.billing ); 
        setBillingInfo(data.app.billing );
      }, 
      error: (data)=>{
        setLoading(false); 
        console.log("error data", data);
        
      }
    })
  }

  function allStandardPlans(){  
    return plans.filter((o)=> o.category.toLowerCase() === "standard")
  }

  function allPremiumPlans(){
    return plans.filter((o)=> o.category.toLowerCase() === "premium")
  }

  function allPlansWithContacts(v){
    var selection = [];
    selection.push(plans.filter((o)=> (o.category.toLowerCase() === "free"))[0])
    var stdPlan = plans.filter((o)=> (o.category.toLowerCase() === "standard" && o.contacts == v))[0]
   
    if(stdPlan)
      selection.push(stdPlan)
    else{
      var stdPlanNext = plans.filter((o)=> (o.category.toLowerCase() === "standard" && o.contacts <= v)).reverse()[0]
      selection.push(stdPlanNext)
    }

    var prePlan = plans.filter((o)=> (o.category.toLowerCase() === "premium" && o.contacts == v))[0]
    
    if(prePlan)
      selection.push(prePlan)
    else{
      var prePlanNext = plans.filter((o)=> (o.category.toLowerCase() === "premium" && o.contacts <= v))[0]
      selection.push(prePlanNext)
    }
   

    return selection; 
  }

  var defaultPlans = plans.slice(0, 3);
  var newTiers = []
  


  if(selectedPlan && selectedPlan.category && selectedPlan.category.toLowerCase() !== "free" && selectedPlan.contacts){
    newTiers = [] 
    var pns = allPlansWithContacts(selectedPlan.contacts); 
    defaultPlans = pns.slice(0, 3); 
  }

  defaultPlans && defaultPlans.forEach(function(plan) {
    var desc = freeDescriptions;
    if(plan && plan.category.toLowerCase() == 'standard')
      desc = standardDescriptions;
    else if(plan && plan.category.toLowerCase() == 'premium')
      desc = premiumDescriptions;
    if(plan){
      var planObj = plan;
      planObj.description = desc;
      newTiers.push(planObj)
    }
  });
  newTiers = newTiers.reverse() 



  var variants = [];
  var variantPlans;
  if(selectedPlan && selectedPlan.category && selectedPlan.category.toLowerCase() == "standard"){ 
    variantPlans = allStandardPlans();
  }
  else   if(selectedPlan && selectedPlan.category && selectedPlan.category.toLowerCase() == "premium"){ 
    variantPlans = allPremiumPlans(); 
  }

  variantPlans && variantPlans.forEach(function(plan, index) {
    var obj = {value: index, label: ( index % 2 == 0 ? kFormatter(plan.contacts) : '' )} 
    variants.push(obj)
  }); 


// const dotenv = require('dotenv')
// // const buf = Buffer.from('hello world')
// // const opt = { debug: true }
// // const config = dotenv.parse(buf, opt)
// const result = dotenv.config()

// if (result.error) {
//   throw result.error
// }

// console.log(result.parsed)

  return (
    <React.Fragment>
      
      <CssBaseline />
       
      {/* Hero unit */}
      <Container spacing={1} maxWidth="lg" component="main" className={classes.heroContent} >
          {viewBilling && <Button variant="outlined" color="primary" onClick={(e) => setViewBilling(false)}  > Back </Button> }
         <Typography component="h6" variant="h6" align="center" color="textPrimary"   > 
           Current Plan: {app.plan.category + "(" + app.plan.contacts + ")"} 
          </Typography>  
          <Typography component="h6" variant="h6" align="center" color="textSecondary"   >
           {viewBilling ? 'Payment Details' : 'Plan Selection' }   
           {loading && <Progress/>}
          </Typography>  
      </Container>
      {/* End hero unit */}


      <Container maxWidth="lg" component="main">
        {viewBilling && <Grid item xs={12} ><PlanPayment selectedPlan={selectedPlan} dispatch={dispatch} billingInfo={billingInfo}/></Grid>}
        {!viewBilling && <Grid container alignItems="flex-start"> 
            <Grid item xs={12} md={9} >
                 

                <Container maxWidth="lg" component="main">
                  <Grid container spacing={1} alignItems="flex-end">
                    {newTiers && newTiers.map(tier => (
                      // Enterprise card is full width at sm breakpoint
                      <Grid item key={tier.name} xs={12} md={4} >
                        <Card className={ ((selectedPlan && selectedPlan.category == tier.category) ? classes.cardSelected : '')}  style={{minHeight: '300px'}} >
                          <CardHeader
                            title={tier.category}
                            subheader={tier.subheader}
                            titleTypographyProps={{ align: 'center' }}
                            subheaderTypographyProps={{ align: 'center' }}
                            action={tier.category === 'Premium' ? <StarIcon /> : null}
                            className={classes.cardHeader}
                          />
                          <ButtonBase 
                                onClick={e => { planChanged(tier)}}
                                style={{width: '100%', height: '100%'}}
                            >
                            <CardContent>
                              <ul style={{minHeight: '100px'}}>
                                {tier.description.map(line => (
                                  <Typography component="li" variant="subtitle1" align="left" key={line}>
                                    {line}
                                  </Typography>
                                ))}
                              </ul>


                              <Typography  variant="h6" color="textPrimary">
                                  You Pay
                              </Typography>
                              <Box className={classes.cardPricing} mt={1}>
                                <Typography variant="h4" color="textPrimary">
                                  $
                                </Typography>
                                <Typography  variant="h4" color="textPrimary">
                                  {tier.amount}
                                </Typography> 
                              </Box>
                              <Typography variant="h6" color="textPrimary">
                                a month
                              </Typography>

                              <Typography variant="h6" color="textSecondary">
                                Seats {tier.seats} 
                              </Typography>
                              <Typography variant="h6" color="textSecondary">
                                with {tier.contacts ? tier.contacts.toLocaleString() : ''} contacts
                              </Typography>

                            </CardContent>
                          </ButtonBase> 
                        </Card>
                      </Grid>
                    ))} 
                  </Grid> 
                </Container>


                {variants && variants.length > 0 && <Container maxWidth="lg" component="main" className={classes.sliderContainer}>
                  <Grid container spacing={1} justify="space-evenly">
                   <Grid item xs={12} key={'slider'}>  
                    <Typography variant="h5" align="center" color="textPrimary" gutterBottom>
                    How many contacts do you have?
                    </Typography>

                    <Typography variant="h6" align="center" color="textSecondary" component="p"> 
                    With the {selectedPlan.category} plan, you can have up to {variants.reverse()[0].label} contacts.
                    </Typography>

                    <Box mt={2}>
                      <Slider  
                          height="25%"
                          defaultValue={0}
                          getAriaValueText={valuetext}
                          aria-labelledby="discrete-slider-small-steps"
                          step={1}
                          variants
                          min={0}
                          max={variants.length - 1 }
                          valueLabelDisplay="off"
                          marks={variants}
                          onChange={sliderPlanChange}  
                        /> 
                     </Box> 
                    </Grid> 
                  </Grid> 
                </Container>
                }

                
                {/* Footer */}
                <Container maxWidth="lg" component="footer" className={classes.footer}>
                  <Typography variant="h6" align="left" color="primary" component="p"> 
                    Compare plan features
                  </Typography>
                  <br/>
                  <Grid container spacing={2} justify="space-evenly" mt={5}>
                    {footers.map(footer => (
                      <Grid item xs={12} md={4} key={footer.title}>
                        
                        <ul>
                          <li key={'f-title'}>
                            <Link href="#" variant="title1" color="primary">
                             {footer.title}
                            </Link>
                          </li>
                          {footer.description.map(item => (
                            <li key={item}>
                              <Link href="#" variant="subtitle1" color="textSecondary">
                              <CheckCircleOutlineIcon />&nbsp;{item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </Grid>
                    ))}
                  </Grid> 
                </Container>
                {/* End footer */}

            </Grid>  
            <Grid item xs={12} md={3} >
                 
              <Grid container  alignItems="flex-start"> 
                <Grid item key={summary.title} xs={12}  md={12}>
                  { selectedPlan && <Card >
                    <CardHeader
                      title={summary.title}
                      subheader={summary.subheader}
                      titleTypographyProps={{ align: 'center' }}
                      subheaderTypographyProps={{ align: 'center' }}
                      action={summary.title === 'Pro' ? <StarIcon /> : null}
                      className={classes.paymentSummaryHeader}
                    />
                    <ButtonBase  
                          style={{width: '100%', height: '100%'}}
                      >
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
                          <Typography component="li" variant="subtitle1" align="center">
                            Plan: {selectedPlan.category}
                          </Typography> 
                          <Typography component="li" variant="subtitle1" align="center">
                            Contacts: {selectedPlan.contacts ? selectedPlan.contacts.toLocaleString() : ''}
                          </Typography> 
                          {
                            selectedPlan.additionalPrice > 0 && <hr/> && <Typography component="li" variant="subtitle1" align="center">
                            *When you exceed your limit, you incur additional charges of {selectedPlan.additionalPrice}/mo per additional {selectedPlan.additionalContacts} contacts.
                          </Typography> 
                          }
                          
                          

                        </ul>
                        

                      </CardContent>
                    </ButtonBase>
                    <CardActions>
                      <Button fullWidth variant={summary.buttonVariant} color="primary" onClick={(e) => setViewBilling(true)} disabled={(selectedPlan && existingPlan && selectedPlan.name == existingPlan.name)} >
                        {summary.buttonText}
                      </Button> 
                      

                    </CardActions>
                  </Card>
                  }
                </Grid>
              </Grid>   
            </Grid>
          </Grid> 
        }  
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


export default withRouter(connect(mapStateToProps)(Pricing))
