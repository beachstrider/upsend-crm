import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import SettingsIcon from "@material-ui/icons/Settings";
import EmailIcon from "@material-ui/icons/Email";
import BookIcon from "@material-ui/icons/Book";
import SmsIcon from "@material-ui/icons/Sms";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import MessageIcon from "@material-ui/icons/Message";
import FilterFramesIcon from "@material-ui/icons/FilterFrames";
import FolderIcon from "@material-ui/icons/Folder";

import WebhookIcon from "../icons/webhookIcon";
import Switch from "@material-ui/core/Switch";
import Avatar from "@material-ui/core/Avatar";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import HomeOutlined from "@material-ui/icons/HomeOutlined";
import QuestionAnswerOutlined from "@material-ui/icons/QuestionAnswerOutlined";
import FlagOutlined from "@material-ui/icons/FlagOutlined";
import BookOutlined from "@material-ui/icons/BookOutlined";
import SettingsOutlined from "@material-ui/icons/SettingsOutlined";
import DomainOutlined from "@material-ui/icons/DomainOutlined";
import DeviceHubOutlined from "@material-ui/icons/DeviceHubOutlined";
import WidgetsIcon from "@material-ui/icons/Widgets";

import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Tooltip from "@material-ui/core/Tooltip";

import { connect } from "react-redux";
import { Typography } from "@material-ui/core";
import WebSetup from "./webSetup";
import ListMenu from "./ListMenu";
import { signout } from "../actions/auth";

//import I18n from '../i18n.js.erb'

const styles = (theme) => ({
  logo: {
    background: `url(${theme.palette.primary.logo})`,
    width: "100%",
    height: "52px",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  itemLogo: {
    padding: 4,
    cursor: "pointer",
  },
  itemCategoryIcon: {
    display: "flex",
    justifyItems: "center",
    margin: "0px auto",
    marginTop: 16,
    marginBottom: 16,
  },
  upsend: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    //color: theme.palette.primary.contrastText,
    //backgroundColor: theme.palette.background.paper
  },
  itemActionable: {
    "&:hover": {
      backgroundColor: theme.palette.sidebar.hoverBackground,
      borderRadius: "14px",
    },
  },
  itemActiveItem: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.sidebar.activeBackground,
    borderRadius: "11px",
  },
  itemPrimary: {
    color: "inherit",
    fontSize: theme.typography.fontSize,
    "&$textDense": {
      fontSize: theme.typography.fontSize,
    },
    fontWeight: "600",
    textTransform: "Capitalize",
  },
  textDense: {},
  divider: {
    marginTop: theme.spacing(2),
    backgroundColor: "rgba(250, 250, 250, 0.9)",
  },
  expansionPanelDetails: {
    display: "inherit",
    padding: "0px",
  },
  categoryHeaderMini: {
    justifyContent: "center",
    marginTop: "1.2em",
  },
  iconMini: {
    minWidth: "22px",
  },
  iconButtonMini: {
    color: "white",
    backgroundColor: "black",
    borderRadius: 4,
  },
  iconButtonMiniActive: {
    color: "black",
    backgroundColor: "white",
    borderRadius: 4,
    "&:hover": {
      color: "black",
      backgroundColor: "white",
    },
  },
  listStyle: {
    borderRight: `1px solid ${theme.palette.sidebar.color}`,
    display: "flex",
    flexDirection: "column",
  },
  list100: {
    width: "60px",
    backgroundColor: `${theme.palette.sidebar.darkColor}`,
  },
  sectionTitle: {
    marginTop: "8px",
    marginBottom: "2em",
    fontSize: "24px",
    marginLeft: "15px",
  },

  paperSecondaryMenu: {
    width: "234px",
    height: "100vh",
    alignSelf: "flex-end",
    padding: ".5em",
    backgroundColor: `${theme.palette.background.default}`,
  },
});

function Navigator(props, context) {
  const {
    classes,
    app,
    match,
    location,
    visitApp,
    apps,
    onClose,
    mini,
    current_page,
    current_section,
    toggleTheme,
    themeValue,
    current_user,
    dispatch,
    ...other
  } = props;

  const appid = `/apps/${app.key}`;

  const [expanded, setExpanded] = useState(current_section);

  useEffect(() => {
    setExpanded(current_section);
  }, [current_section]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function isActivePage(page) {
    return current_page === page;
  }

  function isActiveSection(section) {
    return current_section === section;
  }

  function handleSignout() {
    dispatch(signout());
  }

  const categories = [
    {
      id: "Dashboard",
      icon: <HomeOutlined style={{ fontSize: 30 }} />,
      label: `${app.name} Overview`,
      url: `/apps/${app.key}`,
      active: isActiveSection("Dashboard"),
      children: [
        {
          render: (props) => [
            <ListItem>
              <Typography variant={"caption"}>
                👋 Hey!, you are viewing the <strong>{app.name}'s</strong>{" "}
                dashboard!
                <br />
                Get you installation snippet for the{" "}
                <WebSetup classes={classes} />.
              </Typography>
            </ListItem>,
          ],
        },
      ],
    },
    {
      id: I18n.t("navigator.platform"),
      icon: <DomainOutlined style={{ fontSize: 30 }} />,
      url: `/apps/${app.key}/segments/${
        app.segments ? app.segments[0].id : ""
      }`,
      active: isActiveSection(I18n.t("navigator.platform")),
      children: app.segments.map((o) => ({
        id: o.name,
        icon: null,
        url: `/apps/${app.key}/segments/${o.id}`,
        active: isActivePage(`segment-${o.id}`),
      })),
    },
    {
      id: I18n.t("navigator.conversations"),
      icon: <QuestionAnswerOutlined style={{ fontSize: 30 }} />,
      url: `/apps/${app.key}/conversations`,
      active: isActiveSection(I18n.t("navigator.conversations")),
      children: [
        {
          id: "Conversations",
          icon: <SmsIcon />,
          url: `/apps/${app.key}/conversations`,
          active: isActivePage("Conversations"),
        },
        {
          id: "Assignment Rules",
          icon: <ShuffleIcon />,
          url: `/apps/${app.key}/conversations/assignment_rules`,
          active: isActivePage("Assignment Rules"),
        },
      ],
    },
    {
      id: I18n.t("navigator.campaigns"),
      url: `/apps/${app.key}/campaigns`,
      icon: <FlagOutlined style={{ fontSize: 30 }} />,
      active: isActiveSection(I18n.t("navigator.campaigns")),
      children: [
        {
          id: "campaigns",
          label: "Mailing Campaigns",
          icon: <EmailIcon />,
          url: `${appid}/messages/campaigns`,
          active: isActivePage("campaigns"),
        },
        {
          id: "user_auto_messages",
          label: "In App messages",
          icon: <MessageIcon />,
          url: `${appid}/messages/user_auto_messages`,
          active: isActivePage("user_auto_messages"),
        },
        {
          id: "tours",
          label: "Guided tours",
          icon: <FilterFramesIcon />,
          url: `${appid}/messages/tours`,
          active: isActivePage("tours"),
        },
      ],
    },

    {
      id: "Bot",
      label: I18n.t("navigator.routing_bots"),
      icon: <DeviceHubOutlined style={{ fontSize: 30 }} />,
      url: `/apps/${app.key}/bots/settings`,
      active: isActiveSection("Bot"),
      children: [
        {
          id: "For Leads",
          icon: <AssignmentIndIcon />,
          url: `${appid}/bots/leads`,
          active: isActivePage("botleads"),
        },
        {
          id: "For Users",
          icon: <PermIdentityIcon />,
          url: `${appid}/bots/users`,
          active: isActivePage("botusers"),
        },
        {
          id: "Settings",
          icon: <SettingsIcon />,
          url: `${appid}/bots/settings`,
          active: isActivePage("botSettings"),
        },
      ],
    },

    {
      label: I18n.t("navigator.help_center"),
      id: "HelpCenter",
      icon: <BookOutlined style={{ fontSize: 30 }} />,
      url: `/apps/${app.key}/articles`,
      active: isActiveSection("HelpCenter"),
      children: [
        {
          id: "Articles",
          icon: <BookIcon />,
          url: `/apps/${app.key}/articles`,
          active: isActivePage("Articles"),
        },
        {
          id: "Collections",
          icon: <FolderIcon />,
          url: `/apps/${app.key}/articles/collections`,
          active: isActivePage("Collections"),
        },
        {
          id: "Settings",
          icon: <SettingsIcon />,
          url: `/apps/${app.key}/articles/settings`,
          active: isActivePage("Settings"),
        },
      ],
    },

    {
      id: "Settings",
      label: I18n.t("navigator.settings"),
      icon: <SettingsOutlined style={{ fontSize: 30 }} />,
      url: `/apps/${app.key}/settings`,
      active: isActiveSection("Settings"),
      children: [
        {
          id: "App Settings",
          icon: <SettingsIcon />,
          url: `/apps/${app.key}/settings`,
          active: isActivePage("app_settings"),
        },
        {
          id: "Team",
          icon: <SupervisedUserCircleIcon />,
          url: `/apps/${app.key}/team`,
          active: isActivePage("team"),
        },
        {
          id: "Integrations",
          icon: <WidgetsIcon />,
          url: `/apps/${app.key}/integrations`,
          active: isActivePage("integrations"),
        },
        {
          id: "Webhooks",
          icon: <WebhookIcon />,
          url: `/apps/${app.key}/webhooks`,
          active: isActivePage("webhooks"),
        },
        //{ id: 'Authentication', icon: <ShuffleIcon />, active: isActivePage("user_auto_messages")},
      ],
    },

    {
      id: "User",
      render: () => (
        <ListMenu
          //handleClick={visitApp}
          button={
            <IconButton
              //onClick={()=>{
              //  signout()
              //}}
              className={classes.itemCategoryIcon}
              color="inherit"
            >
              <Avatar className={classes.avatar} src={current_user.avatarUrl} />
            </IconButton>
          }
          options={[
            {
              key: "new-app",
              name: "Create new app",
              onClick: () => {
                //this.props.dispatch(clearApp())
                context.router.history.push(`/apps/new`);
              },
            },
            //{type: "divider"},
            //{key: "terms", name: "Terms", onClick: ()=>{ alert("oe") }},
            //{key: "docs", name: "Upsend documentation", onClick: ()=>{ alert("oe") }},
            { type: "divider" },
            //{key: "profile", name: "Profile", onClick: ()=>{ context.router.history.push(`/apps/${props.app.key}/agents/${props.currentUser.id}`) }},
            {
              key: "signout",
              name: "Log out",
              onClick: () => {
                handleSignout();
              },
            },
          ]}
        />
      ),
    },
  ];

  function renderMiniItemList() {
    //console.log("kategories", categories, navigation )
    return categories
      .filter((o) => !o.hidden)
      .map(({ id, url, label, icon, active, children, render }) => {
        return render ? (
          render()
        ) : (
          <ListItem className={classes.categoryHeaderMini}>
            {icon && (
              <Tooltip title={label || id} placement="right">
                <ListItemIcon className={classes.iconMini}>
                  <IconButton
                    className={
                      active
                        ? classes.iconButtonMiniActive
                        : classes.iconButtonMini
                    }
                    onClick={() => {
                      if (url) context.router.history.push(url);
                    }}
                  >
                    {icon}
                  </IconButton>
                </ListItemIcon>
              </Tooltip>
            )}
          </ListItem>
        );
      });
  }

  function renderListHeader() {
    return (
      <React.Fragment>
        <ListItem
          onClick={() => context.router.history.push(`/apps`)}
          className={clsx(classes.upsend, classes.itemLogo)}
        >
          <div className={classes.logo} />
        </ListItem>
      </React.Fragment>
    );
  }

  function renderInner() {
    return categories
      .filter((o) => o.id === current_section)
      .map(({ id, label, icon, children }) => {
        //  expanded={expanded === id}
        return (
          <div>
            <Typography className={classes.sectionTitle} variant={"h4"}>
              {id || label}
            </Typography>
            <ExpansionPanelDetails className={classes.expansionPanelDetails}>
              {children.map(
                ({ id: childId, label, icon, active, url, onClick, render }) =>
                  render ? (
                    render(classes)
                  ) : (
                    <ListItem
                      button
                      dense
                      key={childId}
                      className={clsx(
                        classes.item,
                        classes.itemActionable,
                        active && classes.itemActiveItem
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        //this.setActiveLink(o, ()=>{
                        url ? context.router.history.push(url) : onClick();
                        //})
                      }}
                    >
                      {icon && <ListItemIcon>{icon}</ListItemIcon>}
                      <ListItemText
                        classes={{
                          primary: classes.itemPrimary,
                          dense: classes.textDense,
                        }}
                      >
                        {label || childId}
                      </ListItemText>
                    </ListItem>
                  )
              )}
              <Divider className={classes.divider} />
            </ExpansionPanelDetails>
          </div>
        );
      });
  }

  return (
    <Drawer
      PaperProps={props.PaperProps}
      variant={props.variant}
      open={props.open}
      onClose={props.onClose}
      className={classes.listStyle}
    >
      <List disablePadding className={classes.list100}>
        {renderListHeader()}
        {renderMiniItemList()}
      </List>

      {current_section && (
        <div className={classes.paperSecondaryMenu} style={{backgroundColor: '#FAF7F2'}}>{renderInner()}</div>
      )}
    </Drawer>
  );
}

Navigator.contextTypes = {
  router: PropTypes.object,
};

/*
Navigator.propTypes = {
  open: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  app: PropTypes.object,
  currentUser: PropTypes.object
};*/

//export default withStyles(styles)(Navigator);

function mapStateToProps(state, ownProps) {
  const { auth, app, segment, app_users, navigation, current_user } = state;
  const { loading, isAuthenticated } = auth;

  const { current_page, current_section } = navigation;

  return {
    app,
    current_user,
    current_page,
    current_section,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(Navigator));
