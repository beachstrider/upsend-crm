import PropTypes from "prop-types";
import React, { Component } from "react";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Moment from "react-moment";
import ContentHeader from "../components/ContentHeader";
import Content from "../components/Content";

import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";

import CircularProgress from "@material-ui/core/CircularProgress";
import { AnchorLink } from "../shared/RouterLink";

import MainSection from "../components/MainSection";
import ContentWrapper from "../components/ContentWrapper";
import PageTitle from "../components/PageTitle";
import logo from "../images/logo.png";
import DataTable from "../components/table";
import { Datatable } from "../components/datatable/";

import { Link } from "react-router-dom";

import graphql from "../graphql/client";
import { AGENTS, PENDING_AGENTS } from "../graphql/queries";
import { INVITE_AGENT } from "../graphql/mutations";

import { withStyles } from "@material-ui/core/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

import FormDialog from "../components/FormDialog";
import { setCurrentPage, setCurrentSection } from "../actions/navigation";
import styled from "@emotion/styled";

import Box from '@material-ui/core/Box'; 

const styles = (theme) => ({
  addUser: {
    marginRight: theme.spacing(1),
  },
});

const BtnTabContainer = styled.div`
  background-color: #fff;

  button {
    margin-left: 0;
    min-width: 140px;
    min-height: unset;

    span {
      border-radius: 4px;
      padding: 10px;
      z-index: 1;
    }
  }

  button.Mui-selected {
    font-weight: 600;

    span {
      background-color: rgb(250, 247, 242);
    }
  }
`;

class TeamPage extends Component {
  state = {
    meta: {},
    tabValue: 0,
  };

  componentDidMount() {
    this.props.dispatch(setCurrentSection("Settings"));
    this.props.dispatch(setCurrentPage("team"));
  }

  handleTabChange = (e, i) => {
    this.setState({ tabValue: i });
  };

  tabsContent = () => {
    return (
      <BtnTabContainer>
        <Tabs
          value={this.state.tabValue}
          onChange={this.handleTabChange}
          textColor="inherit"
          style={{
            marginLeft: "24px",
            marginRight: "24px",
            padding: "16px 0",
            borderTop: "solid 1px rgba(0,0,0,0.12)",
          }}
        >
          <Tab textColor="inherit" label="Team" />
          <Tab textColor="inherit" label="Invitations" />
        </Tabs>
      </BtnTabContainer>
    );
  };

  renderTabcontent = () => {
    switch (this.state.tabValue) {
      case 0:
        return <AppUsers {...this.props} />;

      case 1:
        return <NonAcceptedAppUsers {...this.props} />;
      case 2:
        return;
      case 3:
        return <p></p>;
    }
  };

  render() {
    return (
      <React.Fragment>
        <ContentHeader title={"Team"} tabsContent={this.tabsContent()} />

        {this.renderTabcontent()}
      </React.Fragment>
    );
  }
}

class AppUsers extends React.Component {
  state = {
    collection: [],
    loading: true,
    visible_cols: [
      "id",
      "name",
      "email",
      "signInCount",
      "lastSignInAt",
      "invitationAcceptedAt",
    ],
    selected_users: [],
  };

  componentDidMount() {
    this.search();
  }

  getAgents = () => {
    graphql(
      AGENTS,
      { appKey: this.props.app.key },
      {
        success: (data) => {
          this.setState({
            collection: data.app.agents,
            loading: false,
          });
        },
        error: () => {},
      }
    );
  };
  search = (item) => {
    this.setState(
      {
        loading: true,
      },
      this.getAgents
    );
  };

  render() {
    const columns = [
      {
        name: "ID",
        selector: "id",
        sortable: true,
        width: "60px",
        omit: this.state.visible_cols.indexOf("id") === -1,
      },
      {
        name: "Name",
        selector: "name",
        sortable: true,
        width: "160px",
        omit: this.state.visible_cols.indexOf("name") === -1,
        cell: (row) => (
          <>
            <Link to={`/apps/${this.props.app.key}/agents/${row.id}`} style={{color: '#000'}}>
            <Avatar
              alt="Remy Sharp"
              src={row.avatarUrl}
              style={{
                width: "20px",
                height: "20px",
                cursor: "pointer",
              }}
            />
            </Link>
            &nbsp;
            <Link to={`/apps/${this.props.app.key}/agents/${row.id}`} style={{color: '#000'}}>
              {row.name}
            </Link>
          </>
        ),
      },
      {
        name: "Email",
        selector: "email",
        sortable: true,
        width: "260px",
        omit: this.state.visible_cols.indexOf("email") === -1,
      },
      {
        name: "Signin Count",
        selector: "signInCount",
        sortable: true,
        width: "200px",
        omit: this.state.visible_cols.indexOf("signInCount") === -1,
      },
      {
        name: "Last Signin At",
        selector: "lastSignInAt",
        sortable: true,
        width: "200px",
        omit: this.state.visible_cols.indexOf("lastSignInAt") === -1,
        cell: (row) =>
          row.lastSignInAt ? (
            <Tooltip title={row.lastSignInAt}>
              <Moment fromNow>{row.lastSignInAt}</Moment>
            </Tooltip>
          ) : null,
      },
      {
        name: "Invitation Accepted At",
        selector: "invitationAcceptedAt",
        sortable: true,
        omit: this.state.visible_cols.indexOf("invitationAcceptedAt") === -1,
        cell: (row) =>
          row.invitationAcceptedAt ? (
            <Tooltip title={row.invitationAcceptedAt}>
              <Moment fromNow>{row.invitationAcceptedAt}</Moment>
            </Tooltip>
          ) : null,
      },
    ];
    return (
      <div
        style={{ margin: "0 50px", borderTop: "solid 1px rgba(0,0,0,.125)" }}
      >
        {!this.state.loading ? (
          <Datatable
            columns={columns}
            data={this.state.collection}
            pagination
            onSelectedRowsChange={(s) =>
              this.setState({ selected_users: s.selectedRows })
            }
          />
        ) : (
          <CircularProgress />
        )}
      </div>
    );
  }
}

class NonAcceptedAppUsers extends React.Component {
  state = {
    collection: [],
    loading: true,
    isOpen: false,
    sent: false,
    visible_cols: [
      "id",
      "name",
      "email",
      "invitationAcceptedAt",
      "invitationSentAt",
    ],
    selected_users: [],
  };

  input_ref = null;

  open = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });

  componentDidMount() {
    this.search();
  }

  sendInvitation = () => {
    graphql(
      INVITE_AGENT,
      {
        appKey: this.props.app.key,
        email: this.input_ref.value,
      },
      {
        success: (data) => {
          this.setState(
            {
              sent: true,
              isOpen: false,
            },
            this.search
          );
        },
        error: () => {},
      }
    );
  };

  inviteButton = () => {
    return (
      <React.Fragment>
        {this.state.isOpen ? (
          <FormDialog
            open={this.state.isOpen}
            actionButton={"add user"}
            titleContent={"Add a new agent"}
            contentText={"send an activable invitation"}
            formComponent={
              <TextField
                autoFocus
                margin="dense"
                id="email"
                name="email"
                label="email"
                type="email"
                ref={"input"}
                fullWidth
                inputRef={(input) => (this.input_ref = input)}
              />
            }
            dialogButtons={
              <React.Fragment>
                <Button onClick={this.close} color="secondary">
                  Cancel
                </Button>

                <Button onClick={this.sendInvitation} color="primary">
                  Send invitation
                </Button>
              </React.Fragment>
            }
          />
        ) : null}

        <Button
          variant="contained"
          color="primary"
          onClick={this.open}
          className={this.props.classes.addUser}
        >
          Add user
        </Button>
      </React.Fragment>
    );
  };

  getAgents = () => {
    graphql(
      PENDING_AGENTS,
      { appKey: this.props.app.key },
      {
        success: (data) => {
          this.setState({
            collection: data.app.notConfirmedAgents,
            loading: false,
          });
        },
        error: () => {},
      }
    );
  };

  search = () => {
    this.setState(
      {
        loading: true,
      },
      this.getAgents
    );
  };

  render() {
    const columns = [
      {
        name: "ID",
        selector: "id",
        sortable: true,
        width: "60px",
        omit: this.state.visible_cols.indexOf("id") === -1,
      },
      {
        name: "Name",
        selector: "name",
        sortable: true,
        width: "160px",
        omit: this.state.visible_cols.indexOf("name") === -1,
        cell: (row) => (
          <>
            <Avatar
              alt="Remy Sharp"
              src={row.avatarUrl}
              style={{
                width: "20px",
                height: "20px",
                cursor: "pointer",
              }}
            />
            &nbsp;
            <a href="#" style={{ color: "#000" }}>
              {row.name}
            </a>
          </>
        ),
      },
      {
        name: "Email",
        selector: "email",
        sortable: true,
        width: "260px",
        omit: this.state.visible_cols.indexOf("email") === -1,
      },
      {
        name: "Invitation Accepted At",
        selector: "invitationAcceptedAt",
        sortable: true,
        width: 260,
        omit: this.state.visible_cols.indexOf("invitationAcceptedAt") === -1,
        cell: (row) =>
          row.invitationAcceptedAt ? (
            <Tooltip title={row.invitationAcceptedAt}>
              <Moment fromNow>{row.invitationAcceptedAt}</Moment>
            </Tooltip>
          ) : null,
      },
      {
        name: "Invitation Sent At",
        selector: "invitationSentAt",
        sortable: true,
        omit: this.state.visible_cols.indexOf("invitationSentAt") === -1,
        cell: (row) =>
          row.invitationSentAt ? (
            <Tooltip title={row.invitationSentAt}>
              <Moment fromNow>{row.invitationSentAt}</Moment>
            </Tooltip>
          ) : null,
      },
    ];

    return (
      <div
        style={{ margin: "0 50px", borderTop: "solid 1px rgba(0,0,0,.125)" }}
      >
        <Box align={'right'}>
          {this.inviteButton()}
        </Box>
        <Box align={'center'}>
        {!this.state.loading ? (
          <Datatable
            columns={columns}
            data={this.state.collection}
            pagination
            onSelectedRowsChange={(s) =>
              this.setState({ selected_users: s.selectedRows })
            } 
          />
        ) : (
          <CircularProgress />
        )}
        </Box>

      </div>
    );
  }
}

function mapStateToProps(state) {
  const { auth, app } = state;
  const { isAuthenticated } = auth;

  return {
    app,
    isAuthenticated,
  };
}

export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(TeamPage))
);
