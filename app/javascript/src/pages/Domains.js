import React, {
  useState, 
  useEffect, 
  useRef
} from 'react'

import {
  camelizeKeys
} from '../actions/conversation'

import {isEmpty} from 'lodash'

import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit'
import AddIcon from '@material-ui/icons/Add';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell'; 
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Progress from '../shared/Progress'

import ContentHeader from '../components/ContentHeader'
import Content from '../components/Content'
import FormDialog from '../components/FormDialog'
import FieldRenderer from '../shared/FormFields'
import DeleteDialog from "../components/deleteDialog"

import {errorMessage, successMessage} from '../actions/status_messages'
import { setCurrentPage, setCurrentSection } from "../actions/navigation";

import graphql from '../graphql/client'
import {
  EVENT_TYPES,
  SES_IDENTITIES
} from '../graphql/queries'
import {
  SES_IDENTITY_CREATE,
  SES_IDENTITY_UPDATE,
  SES_IDENTITY_DELETE
} from '../graphql/mutations' 
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import serialize from 'form-serialize'


function DomainIntegrations({app, dispatch}){ 

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [eventTypes, setEventTypes] = useState([])
  const [errors, setErrors] = useState([])
  const [domainAddresses, setDomainAddresses] = useState([])
  const [tabValue, setTabValue] = useState(0)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const form = useRef(null);

  useEffect(()=>{
    dispatch(setCurrentSection("Settings"))
    dispatch(setCurrentPage("domains")) 
    fetchIdentities()
  }, [])
  
  function fetchIdentities(){
    setLoading(true) 
    setDomainAddresses([])

    graphql(SES_IDENTITIES, { appKey: app.key  }, {
      success: (data)=>{ 
        setDomainAddresses(data.app.agentSesIdentities)
        setLoading(false)
      }, 
      error: ()=>{
        setLoading(false)
      }
    })
  }

  function handleOpen(service){
    setOpen(service)
  }

  function close(){
    setOpen(false)
  }

  function submit(){
    const serializedData = serialize(form.current, { 
      hash: true, empty: true 
    })
    
    createSesIdentity(serializedData)
  }

  function definitions(){
    return [
      {
        name: 'address',
        type: 'string',
        grid: { xs: 12, sm: 12 }
      }
    ]
  }

  function newDomainAddress(){
    setOpen({
      name: "address", 
      description: 'Domain',
      definitions: definitions()
    })
  }

  function newEmailAddress(){
    setOpen({
      name: "address", 
      description: 'Email Address',
      definitions: definitions()
    })
  }

  function createSesIdentity(serializedData){
    console.log(serializedData);
    const {address} = serializedData.identity
    setLoading(true);
    const identityType = tabValue == 0 ? 'domain' : 'email'

    graphql(SES_IDENTITY_CREATE, {
      appKey: app.key,
      address: address,
      identityType: identityType 
    }, {
      success: (data)=>{
        setLoading(false); 
        

        setTabValue(tabValue)

        const sesIdentity = data.createSesIdentity.sesIdentity
        const errors = data.createSesIdentity.errors
        if(!isEmpty(errors)) {
          console.log("errors", errors); 
          setErrors(errors)
          return
        }
        
        const newIntegrations = domainAddresses.concat(sesIdentity) 
        setDomainAddresses(newIntegrations) 
        setOpen(null)
        const message = (tabValue == 0) ? "Domain added successfully" : "Email address added successfully "
        dispatch(successMessage(message)) 
        fetchIdentities()
      },
      error: (data)=>{ 
        setLoading(false);
        dispatch(errorMessage("Something went wrong."))
      }
    })
  }
 
  function updateSesIdentityToVerified(serializedData){ 
    const {id} = serializedData
    setLoading(true);
 
    graphql(SES_IDENTITY_UPDATE, {
      appKey: app.key, 
      id: id, 
      address: serializedData.address,
      status: "verified"
    }, {
      success: (data)=>{  
        setLoading(false); 
        setTabValue(tabValue)
        const sesIdentity = data.updateSesIdentity.sesIdentity
        const errors = data.updateSesIdentity.errors
        if(!isEmpty(errors)) {
          console.log("errors", errors); 
          setErrors(errors)
          return
        } 

        const newIntegrations = domainAddresses.map(
          (o)=> o.id === sesIdentity.id ? sesIdentity : o
        ) 

        setDomainAddresses(newIntegrations) 
        setOpen(null)
        const message = (tabValue == 0) ? "Domain updated successfully" : "Email address updated successfully "
        dispatch(successMessage(message)) 
        fetchIdentities()


      },
      error: ()=>{
        //setLoading(false);
        dispatch(errorMessage("Something went wrong."))
      }
    })
  }



  function removeSesIdentity(){
    graphql(SES_IDENTITY_DELETE, { 
      id: parseInt(openDeleteDialog.id),
    }, {
      success: (data)=>{
        setTabValue(tabValue)
        const sesIdentity = data.deleteSesIdentity.sesIdentity
        const newIntegrations = domainAddresses.filter(
          (o)=> o.id != sesIdentity.id
        )
        const errors = data.deleteSesIdentity.errors
        if(!isEmpty(errors)) {
          setErrors(errors)
          return
        }
        setDomainAddresses(newIntegrations)
        setOpen(null)
        setOpenDeleteDialog(null)
        const message = (tabValue == 0) ? "Domain removed successfully" : "Email address removed successfully "
        dispatch(successMessage(message))
      },
      error: ()=>{
        dispatch(errorMessage("Something went wrong."))
      }
    })
  }

  function handleTabChange(e, i){
    setTabValue(i)
  }

  function tabsContent(){
    return <Tabs value={tabValue} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              textColor="inherit">
              <Tab textColor="inherit" label="Domains" /> 
              <Tab textColor="inherit" label="Email Addresses" />
            </Tabs>
  }

  function renderTabcontent(){

    function allDomainAddresses(){  
      return domainAddresses.filter((o)=> o.identityType === "domain")
    }

    function allEmailAddresses(){
      return domainAddresses.filter((o)=> o.identityType === "email")
    }

    switch (tabValue){
      case 0:
        return <React.Fragment>

                <Grid container justify={"space-between"}>
                  <Typography variant={"h5"}> 
                    Listing all Domains 
                  </Typography>

                  {loading && <Progress/>}


                  <Button 
                    variant={"outlined"} 
                    color={'primary'} 
                    onClick={newDomainAddress} 
                    disabled={allDomainAddresses().length > 0 ? true : false}
                    >
                    Add Domain
                  </Button>

                </Grid>

                  <List>
                    {
                      allDomainAddresses().map((o) => 
                        <DomainAddressItem 
                          sesIdentity={o} 
                          key={`domain-address-${o.id}`} 
                          handleDelete={(o)=> setOpenDeleteDialog(o)}
                          updateSesIdentityToVerified={(o) => updateSesIdentityToVerified(o)}
                        />
                      )
                    }
                  </List>

                  {
                    allDomainAddresses().length === 0 && !loading &&
                    <EmptyCard 
                      tabValue={tabValue}
                      goTo={()=>{setTabValue(0)}}
                    />
                  }

             
                </React.Fragment>
      case 1:
        return <React.Fragment>
               
                <Grid container justify={"space-between"}>
                  <Typography variant={"h6"}> 
                    Listing all Email Addresses
                  </Typography>

                  {loading && <Progress/>}

                  <Button 
                    variant={"outlined"} 
                    color={'primary'} 
                    onClick={newEmailAddress}>
                    New Email Address
                  </Button>

                </Grid>

                <List>
                  {
                    allEmailAddresses().map((o) => 
                      <EmailAddressItem 
                        sesIdentity={o} 
                        key={`email-address-${o.id}`} 
                        handleDelete={(o)=> setOpenDeleteDialog(o)}
                        updateSesIdentityToVerified={(o) => updateSesIdentityToVerified(o)}
                      />
                    )
                  }
                </List>

                  {
                    allEmailAddresses().length === 0 && !loading &&
                    <EmptyCard 
                      tabValue={tabValue}
                      goTo={()=>{setTabValue(1)}}
                    />
                  }

                </React.Fragment>
    }
  }

  return <React.Fragment>
            <ContentHeader 
              title={ 'Domain Settings' }
              tabsContent={ tabsContent() }
            />
            <Content>
              {renderTabcontent()}

            </Content>

            {open && (
              <FormDialog 
                open={open}
                titleContent={`${tabValue == 0 ? 'Add Domain' : 'Add Email Address'}`}
                formComponent={
                    <form ref={form}>
                      <Grid container spacing={3}>
                        {
                          definitions().map((field) => {
                            return <Grid item
                                      key={field.name} 
                                      xs={field.grid.xs} 
                                      sm={field.grid.sm}>
                                      <FieldRenderer 
                                        namespace={'identity'} 
                                        data={camelizeKeys(field)}
                                        props={{
                                          data: open
                                        }} 
                                        errors={ errors }
                                      />
                                  </Grid>
                          })
                        }
                      </Grid>

                    </form> 
                }
                dialogButtons={
                  <React.Fragment>
                    <Button 
                      onClick={close} 
                      color="secondary">
                      Cancel
                    </Button>

                    <Button onClick={ submit } 
                      color="primary">
                      {'Create'}
                    </Button>

                  </React.Fragment>
                }
                >
              </FormDialog>
            )}

            {
              openDeleteDialog && <DeleteDialog 
               open={openDeleteDialog}
               title={tabValue == 0 ? 'Delete domain ?' : 'Delete Email Address'} 
               closeHandler={()=>{
                 setOpenDeleteDialog(null)
               }}
               deleteHandler={()=> { 
                 removeSesIdentity(openDeleteDialog)
                }}>
               <Typography variant="subtitle2">
                 The {tabValue == 0 ? 'domain' : 'Email Address'} will be removed immediately. Are you sure?
               </Typography>
             </DeleteDialog>
            }

        </React.Fragment>
  }

function CnameRecords({sesIdentity,updateSesIdentityToVerified}){

return (  
      <React.Fragment>
        <Typography>
          To be able to send emails from this domain, we need to verify that you are allowed to do it. You need to add the below DNS Record to your domain {sesIdentity.address}
        </Typography>  
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">TYPE</TableCell>
              <TableCell align="right">Value</TableCell> 
            </TableRow>
          </TableHead>
          <TableBody> 
            {sesIdentity.verificationRecord && sesIdentity.verificationRecord.map((row) => ( 
               
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell> 
                <TableCell align="right">{row.type}</TableCell>
                <TableCell align="right">{row.value}</TableCell> 
              </TableRow>
            ))} 

            {sesIdentity.cnameRecords && sesIdentity.cnameRecords.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell> 
                <TableCell align="right">{row.type}</TableCell>
                <TableCell align="right">{row.value}</TableCell> 
              </TableRow>
            ))}
          </TableBody>
        </Table> 
        <br/>  
        {
          sesIdentity.status == "pending" ?
          (
            <Button variant="contained" color="primary" onClick={() => updateSesIdentityToVerified(sesIdentity)}>
              Yes, I have verified domain {sesIdentity.address}
            </Button>
          ) : null
        }
      </React.Fragment>
    )

}




function EmailAddressItem({sesIdentity, handleDelete, updateSesIdentityToVerified}){ 
  return <ListItem>
            <ListItemText 
              primary={
                  <Typography variant="h5">
                    {sesIdentity.address} 
                  </Typography>

                } 
              secondary={<div>
                <Chip
                  size="small"
                  label={sesIdentity.status}
                  color="primary"
                /> 
              </div>} 
             />

            <ListItemSecondaryAction> 
              
              <div>
                

                {
                sesIdentity.status == "pending" ?
                  (
                    <Button variant="contained" color="primary" onClick={() => updateSesIdentityToVerified(sesIdentity)}>
                      Yes, I have verified
                    </Button>
                  ) : null
                } 

                { 
                  sesIdentity.id && <IconButton 
                    onClick={()=> handleDelete(sesIdentity) }
                    edge="end" aria-label="add">
                    <DeleteIcon  />
                  </IconButton>
                }

              </div>
            </ListItemSecondaryAction>
          </ListItem>

        {/*sesIdentity.id*/}
}

function DomainAddressItem({sesIdentity, handleDelete, updateSesIdentityToVerified}){ 
  return <ListItem>
            <ListItemText 
              primary={
                  <Typography variant="h5">
                    {sesIdentity.address}
                    <div>
                    <Chip
                      size="small"
                      label={sesIdentity.status}
                      color="primary"
                    /> 

                    { 
                      sesIdentity.id && <IconButton 
                        onClick={()=> handleDelete(sesIdentity) }
                        edge="end" aria-label="add">
                        <DeleteIcon  />
                      </IconButton>
                    }
                    </div>
                  </Typography>

                } 
              secondary={

                <div>
                  <CnameRecords sesIdentity={sesIdentity} updateSesIdentityToVerified={() => updateSesIdentityToVerified(sesIdentity)}/> 
                </div>
            } />

            <ListItemSecondaryAction> 
              
              
            </ListItemSecondaryAction>
          </ListItem>

        {/*sesIdentity.id*/}
}

function EmptyCard({goTo, tabValue}){
  return (
    <Card style={{marginTop: '2em'}}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
        </Typography>
        <Typography variant="h5" component="h2">
          You don't have any {(tabValue == 0) ? 'domains' : 'email addresses'} yet
        </Typography>
        <Typography color="textSecondary">
          To be able to send emails you need to add and verify domains or email addresses.
        </Typography>
      </CardContent>
    </Card>
  )
}


function mapStateToProps(state) {
  const { app } = state 
  return {
    app,
  }
}

export default withRouter(connect(mapStateToProps)(DomainIntegrations))



