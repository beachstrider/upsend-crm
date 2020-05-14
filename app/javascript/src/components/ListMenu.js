import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Divider from '@material-ui/core/Divider';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'


const useStyles = makeStyles(theme => ({
  root: {
    //width: '100%',
    //maxWidth: 360,
    //backgroundColor: theme.palette.background.paper,
  },
}));


function SimpleListMenu(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex,] = React.useState(props.app || {} );
  const [state, setState] = React.useState({
    away_mode: false,
  });

  const AntSwitch = withStyles((theme) => ({
    root: {
      width: 38,
      height: 21,
      padding: 0,
      display: 'flex',
    },
    switchBase: {
      padding: 2,
      color: theme.palette.grey[500],
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          opacity: 1,
          backgroundColor: '#1976d2',
          borderColor: '#1976d2',
        },
      },
    },
    thumb: {
      width: 17,
      height: 17,
      boxShadow: 'none',
    },
    track: {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 20 / 2,
      opacity: 1,
      backgroundColor: theme.palette.common.white,
    },
    checked: {},
  }))(Switch);

  function handleClickListItem(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuItemClick(event, index) {
    setSelectedIndex(index);
    setAnchorEl(null);
    index.onClick ? index.onClick(index) : props.handleClick(index)
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function mergeButton(){
    return React.cloneElement(
      props.button,
      {onClick: handleClickListItem}
    )
  }

  return (
    <React.Fragment>

      {
        props.button ? mergeButton() : 
      
        <List component="nav">
          <ListItem
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            aria-label="Switch application"
            onClick={handleClickListItem}
          >
            <ListItemText 
              primary="Switch application" 
            />
            {Boolean(anchorEl) ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
        </List>
      }
      {typeof(props.options) !== 'undefined' ? 
        <Menu id="lock-menu" anchorEl={anchorEl} 
          open={Boolean(anchorEl)} 
          onClose={handleClose}
          /*anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}*/
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}>

          {props.options.map((option, index) => (
            option.type === "divider" ? 
            <Divider key={`list-menu-${index}-${option.type}`}/> :
            <MenuItem
              key={`list-menu-${index}-${option.type}`}
              //disabled={index === 0}
              selected={selectedIndex.key === option.key}
              onClick={event => handleMenuItemClick(event, option)}
            >
              {option.name}
            </MenuItem>
          ))}
        </Menu>
      : ''}
      {props.avatarDropdown === true ?
        <Menu className="avatar-menu" id="lock-menu" anchorEl={anchorEl}
          open={Boolean(anchorEl)} 
          onClose={handleClose}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <div style={{
            backgroundColor: '#000',
            borderRadius: '4px',
            color: '#fff'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              padding: '30px 20px',
            }}>
              <span>Away mode</span>
              <AntSwitch checked={state.away_mode} onChange={() => setState({away_mode: !state.away_mode})} name="checkedC" />
            </div>
            <div style={{
              display: 'flex',
              padding: '18px 20px',
              borderTop: 'solid 1px #222'
            }}>
              <div style={{
                marginRight: '16px',
                paddingTop: '4px'
              }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#65AB72'
                }}>

                </div>
              </div>
              <div>
                <h2 style={{margin: 0}}>Brian</h2>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '400'
                }}>Active</div>
              </div>
            </div>
          </div>
          <div style={{
            padding: '18px 20px',
            borderBottom: 'solid 1px rgba(0,0,0,.125)'
          }}>
            <div style={{marginBottom: '20px'}}>
              <a style={{display: 'flex', justifyContent: 'space-between'}}>
                <span>{props.app.name}</span>
                <span>►</span>
              </a>
              <div style={{
                fontSize: '11px',
                marginTop: 6
              }}>Create or switch workspaces</div>
            </div>
            <div>
              <a className="av-m-link" onClick={() => {props.history.push(`/apps/${props.app.key}/account`);handleClose();}}><i className="fa fa-user"></i>&nbsp;&nbsp;&nbsp;Your account</a>
              <a className="av-m-link" onClick={() => {props.history.push(`/apps/${props.app.key}/pricing`);handleClose();}}><i className="fa fa-credit-card"></i>&nbsp;&nbsp;&nbsp;Billing</a>
            </div>
          </div>
          <div style={{
            padding: '18px 20px',
            borderBottom: 'solid 1px rgba(0,0,0,.125)'
          }}>
            <a className="av-m-link">Upsend Help Center</a>
            <a className="av-m-link">Status page</a>
            <a className="av-m-link">Terms & Policies</a>
          </div>
          <div style={{
            padding: '18px 20px',
          }}>
            <a className="av-m-link" onClick={() => props.onSignout()}><i class="fa fa-sign-out-alt"></i>&nbsp;&nbsp;&nbsp;Log out</a>
          </div>
        </Menu>
      : ''}
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  const { app } = state
  return {
    app
  }
}

export default withRouter(connect(mapStateToProps)(SimpleListMenu))


//export default SimpleListMenu;
