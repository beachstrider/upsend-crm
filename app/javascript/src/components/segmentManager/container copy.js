import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import { InlineFilterDialog, SaveSegmentModal } from "../segmentManager";
import SegmentItemButton from "./itemButton";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import Map from "../map/index.js";
import { dispatchSegmentUpdate } from "../../actions/segments";
import { setCurrentSection, setCurrentPage } from "../../actions/navigation";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";

import Table from "../table/index";
import userFormat from "../table/userFormat";

import { Datatable, IconColName } from "../../components/datatable/";

import icon_face from "../../icons/bxs-face.svg";
import icon_email from "../../icons/bxs-envelope.svg";
import icon_state from "../../icons/bx-check.svg";
import icon_phone from "../../icons/bxs-phone.svg";
import icon_calc from "../../icons/bxs-calendar.svg";
import icon_map from "../../icons/bxs-map-alt.svg";
import icon_msg from "../../icons/bxs-message-square-detail.svg";
import icon_col from "../../icons/bx-columns.svg";
import icon_export from "../../icons/bxs-file-export.svg";
import icon_delete from "../../icons/bxs-trash.svg";
import icon_type from "../../icons/bxs-user-detail.svg";
import icon_owner from "../../icons/bxs-lock.svg";
import icon_conversation from "../../icons/bxs-conversation.svg";
import icon_id from "../../icons/bxs-id-card.svg";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: inline-flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  padding-top: 1em;
  padding-bottom: 1em;
  border-top: solid 1px rgba(0, 0, 0, 0.12);
  border-bottom: solid 1px rgba(0, 0, 0, 0.12);
  margin-bottom: 1em;
  button {
    margin-right: 5px !important;
    margin: 2px;
  }
`;

const ButtonGroup1 = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  width: 100%;
  padding-top: 1em;
  padding-bottom: 1em;
  a {
    cursor: pointer;
    display: flex;
    font-weight: 500;
    margin-right: 5px !important;
    margin: 2px;
  }

  a.disabled {
    color: #ccc;
  }
`;

class AppContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getSegment = this.getSegment.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(setCurrentSection("Platform"));

    this.props.dispatch(
      setCurrentPage(`segment-${this.props.match.params.segmentID}`)
    );

    this.props.dispatch(
      dispatchSegmentUpdate({
        id: this.props.match.params.segmentID,
        jwt: this.props.match.params.Jwt,
      })
    );

    this.getSegment(() => {
      this.props.actions.search();
    });
  }

  getSegment() {
    const segmentID = this.props.match.params.segmentID;
    segmentID ? this.props.actions.fetchAppSegment(segmentID) : null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.match.params &&
      prevProps.match.params.segmentID !== this.props.match.params.segmentID
    ) {
      this.props.dispatch(
        dispatchSegmentUpdate({
          id: this.props.match.params.segmentID,
          jwt: this.props.match.params.Jwt,
        })
      );

      this.props.dispatch(
        setCurrentPage(`segment-${this.props.match.params.segmentID}`)
      );

      this.getSegment(() => {
        this.props.actions.search();
      });
    }

    if (
      prevProps.segment.jwt &&
      prevProps.segment.jwt !== this.props.segment.jwt
    ) {
      //console.info("cambio jwt")
      this.props.actions.search();
    }

    // check empty token , used when same sagment changes jwt
    if (
      prevProps.match.params.Jwt !== this.props.match.params.Jwt &&
      !this.props.match.params.Jwt
    ) {
      this.props.dispatch(
        dispatchSegmentUpdate({
          jwt: this.props.match.params.Jwt,
        })
      );

      this.getSegment(() => {
        this.props.actions.search();
      });
    }
  }

  render() {
    const { searching, collection, meta } = this.props.app_users;
    return (
      <div>
        {this.props.app.key && this.props.segment && this.props.segment.id ? (
          <AppUsers
            actions={this.props.actions}
            history={this.props.history}
            app={this.props.app}
            segment={this.props.segment}
            app_users={collection}
            app_user={this.props.app_user}
            meta={meta}
            searching={searching}
          />
        ) : null}
      </div>
    );
  }
}

class AppUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map_view: false,
      rightDrawer: false,
      app_users: props.app_users,
      selected_users: [],
      visible_cols: [
        "displayName",
        "type",
        "owner",
        "conversationRating",
        "email",
        "phone",
        "id",
        "lastSeen",
        "firstSeen",
      ],
    };
    this.toggleMap = this.toggleMap.bind(this);
    this.toggleList = this.toggleList.bind(this);
  }

  toggleMap = (e) => {
    this.setState({ map_view: false });
  };

  toggleList = (e) => {
    this.setState({ map_view: true });
  };

  toggleMapView = (e) => {
    this.setState({ map_view: !this.state.map_view });
  };

  handleClickOnSelectedFilter = (jwtToken) => {
    const url = `/apps/${this.props.app.key}/segments/${this.props.segment.id}/${jwtToken}`;
    this.props.history.push(url);
  };

  displayName = (o) => {
    return o.attribute.split("_").join(" ");
  };

  getTextForPredicate = (o) => {
    if (o.type === "match") {
      return `Match ${o.value === "and" ? "all" : "any"} criteria`;
    } else {
      return `${this.displayName(o)} ${o.comparison ? o.comparison : ""} ${
        o.value ? o.value : ""
      }`;
    }
  };

  getStatePredicate = () => {
    return this.props.actions
      .getPredicates()
      .find((o) => o.attribute === "subscription_state");
  };

  caption = () => {
    return (
      <ButtonGroup>
        <div style={{ display: "inline-flex" }}>
          <InlineFilterDialog
            {...this.props}
            handleClick={this.handleClickOnSelectedFilter.bind(this)}
            addPredicate={this.props.actions.addPredicate}
          />

          <SaveSegmentModal
            title="Save Segment"
            segment={this.props.segment}
            savePredicates={this.props.actions.savePredicates}
            predicateCallback={() => {
              const url = `/apps/${this.props.app.key}/segments/${this.props.segment.id}`;
              this.props.history.push(url);
            }}
            deleteSegment={this.props.actions.deleteSegment}
          />
        </div>
        <div style={{ display: "inline-flex" }}>
          <Button variant="contained">
            &nbsp;&nbsp;&nbsp;
            <img src={icon_msg} style={{ height: "20px" }} />
            &nbsp;&nbsp;New message&nbsp;&nbsp;&nbsp;
          </Button>
          <Button variant="outlined" color="primary">
            &nbsp;&nbsp;&nbsp;
            <img src={icon_col} style={{ height: "20px" }} />
            &nbsp;&nbsp;Edit columns&nbsp;&nbsp;&nbsp;
          </Button>
        </div>
      </ButtonGroup>
    );
  };

  showUserDrawer = (o) => {
    this.props.actions.showUserDrawer(o.id);
  };

  getUserData = (id) => {
    this.props.actions.setAppUser(id);
  };

  render() {
    const columns = [
      {
        name: <IconColName icon={icon_face}>Name</IconColName>,
        selector: "displayName",
        sortable: true,
        width: "160px",
        grow: 2,
        omit: this.state.visible_cols.indexOf("displayName") === -1,
      },
      {
        name: <IconColName icon={icon_type}>Type</IconColName>,
        selector: "type",
        sortable: true,
        width: "100px",
        grow: 2,
        omit: this.state.visible_cols.indexOf("type") === -1,
        cell: (row) => "User",
      },
      {
        name: <IconColName icon={icon_owner}>Owner</IconColName>,
        selector: "owner",
        sortable: true,
        width: "110px",
        grow: 2,
        omit: this.state.visible_cols.indexOf("owner") === -1,
        cell: (row) =>
          typeof row.owner != "undefined" && row.owner !== null ? (
            row.owner
          ) : (
            <span style={{ color: "#ccc" }}>Unknown</span>
          ),
      },
      {
        name: (
          <IconColName icon={icon_conversation}>
            Conversation rating
          </IconColName>
        ),
        selector: "conversationRating",
        sortable: true,
        width: "200px",
        grow: 2,
        omit: this.state.visible_cols.indexOf("conversationRating") === -1,
        cell: (row) =>
          typeof row.conversationRating != "undefined" &&
          row.conversationRating !== null ? (
            row.conversationRating
          ) : (
            <span style={{ color: "#ccc" }}>Unknown</span>
          ),
      },
      {
        name: <IconColName icon={icon_email}>Email</IconColName>,
        selector: "email",
        sortable: true,
        width: "180px",
        omit: this.state.visible_cols.indexOf("email") === -1,
      },
      {
        name: <IconColName icon={icon_phone}>Phone</IconColName>,
        selector: "phone",
        sortable: true,
        width: "180px",
        omit: this.state.visible_cols.indexOf("phone") === -1,
        cell: (row) =>
          typeof row.phone != "undefined" && row.phone !== null ? (
            row.phone
          ) : (
            <span style={{ color: "#ccc" }}>Unknown</span>
          ),
      },
      {
        name: <IconColName icon={icon_id}>User id</IconColName>,
        selector: "id",
        sortable: true,
        width: "140px",
        omit: this.state.visible_cols.indexOf("id") === -1,
      },
      {
        name: <IconColName icon={icon_state}>State</IconColName>,
        selector: "state",
        sortable: true,
        width: "120px",
        omit: this.state.visible_cols.indexOf("state") === -1,
        // cell: row => {
        //   if(row.state == 'subscribed')
        //     return <Button color='primary' style={{textTransform: 'capitalize'}}>{row.state}</Button>
        //   if(row.state == 'passive')
        //     return <Button disabled style={{textTransform: 'capitalize'}}>{row.state}</Button>
        // }
      },
      {
        name: "Online",
        selector: "online",
        sortable: true,
        width: "80px",
        omit: this.state.visible_cols.indexOf("online") === -1,
        cell: (row) =>
          row.online === true ? (
            <RadioButtonCheckedIcon
              fontSize="small"
              style={{ color: green[500] }}
            />
          ) : (
            <RadioButtonUncheckedIcon fontSize="small" color="disabled" />
          ),
      },
      {
        name: <IconColName icon={icon_map}>Lat</IconColName>,
        selector: "lat",
        sortable: true,
        width: "100px",
        omit: this.state.visible_cols.indexOf("lat") === -1,
      },
      {
        name: <IconColName icon={icon_map}>Lng</IconColName>,
        selector: "lng",
        sortable: true,
        width: "100px",
        omit: this.state.visible_cols.indexOf("lng") === -1,
      },
      {
        name: "Postal",
        selector: "postal",
        sortable: true,
        width: "100px",
        omit: this.state.visible_cols.indexOf("postal") === -1,
      },
      {
        name: "Browser Lang",
        selector: "browserLanguage",
        sortable: true,
        width: "130px",
        omit: this.state.visible_cols.indexOf("browserLanguage") === -1,
      },
      {
        name: "Referrer",
        selector: "referrer",
        sortable: true,
        width: "180px",
        omit: this.state.visible_cols.indexOf("referrer") === -1,
      },
      {
        name: "OS",
        selector: "os",
        sortable: true,
        width: "100px",
        omit: this.state.visible_cols.indexOf("os") === -1,
      },
      {
        name: "OS version",
        selector: "osVersion",
        sortable: true,
        width: "120px",
        omit: this.state.visible_cols.indexOf("osVersion") === -1,
      },
      {
        name: "Lang",
        selector: "lang",
        sortable: true,
        width: "180px",
        omit: this.state.visible_cols.indexOf("lang") === -1,
      },
      {
        name: "Web sessions",
        selector: "webSessions",
        sortable: true,
        width: "130px",
        omit: this.state.visible_cols.indexOf("webSessions") === -1,
      },
      {
        name: <IconColName icon={icon_calc}>First seen</IconColName>,
        selector: "firstSeen",
        sortable: true,
        width: "180px",
        omit: this.state.visible_cols.indexOf("firstSeen") === -1,
      },
      {
        name: <IconColName icon={icon_calc}>Last seen</IconColName>,
        selector: "lastSeen",
        sortable: true,
        width: "180px",
        omit: this.state.visible_cols.indexOf("lastSeen") === -1,
      },
      {
        name: <IconColName icon={icon_calc}>Last visited at</IconColName>,
        selector: "lastVisitedAt",
        sortable: true,
        width: "180px",
        omit: this.state.visible_cols.indexOf("lastVisitedAt") === -1,
      },
    ];

    return (
      <Wrapper>
        <h3 style={{ width: "100%", margin: "unset", fontWeight: "400" }}>
          All Users
        </h3>
        <h1
          style={{
            width: "100%",
            margin: "unset",
            marginBottom: "10px",
            fontSize: "46px",
            fontWeight: "400",
          }}
        >
          {this.props.app_users.length}
        </h1>

        {this.caption()}

        {this.state.map_view &&
        !this.props.searching &&
        this.props.app.key &&
        this.props.segment &&
        this.props.segment.id ? (
          <Map
            interactive={true}
            segment={this.props.segment}
            data={this.props.app_users}
          />
        ) : null}

        <ButtonGroup1>
          <a className={this.state.selected_users.length > 0 ? "" : "disabled"}>
            &nbsp;&nbsp;&nbsp;
            <img src={icon_export} style={{ height: "20px" }} />
            &nbsp;&nbsp;Export contracts&nbsp;&nbsp;&nbsp;
          </a>
          <a className={this.state.selected_users.length > 0 ? "" : "disabled"}>
            &nbsp;&nbsp;&nbsp;
            <img src={icon_delete} style={{ height: "20px" }} />
            &nbsp;&nbsp;Delete contracts&nbsp;&nbsp;&nbsp;
          </a>
        </ButtonGroup1>

        {!this.props.searching && (
          <Table
            data={this.props.app_users}
            loading={this.props.searching}
            columns={userFormat(this.showUserDrawer, this.props.app)}
            defaultHiddenColumnNames={[
              "id",
              "state",
              "online",
              "lat",
              "lng",
              "postal",
              "browserLanguage",
              "referrer",
              "os",
              "osVersion",
              "lang",
            ]}
            //selection [],
            tableColumnExtensions={[
              //{ columnName: 'id', width: 150 },
              { columnName: "email", width: 250 },
              { columnName: "lastVisitedAt", width: 120 },
              { columnName: "os", width: 100 },
              { columnName: "osVersion", width: 100 },
              { columnName: "state", width: 80 },
              { columnName: "online", width: 80 },

              //{ columnName: 'amount', align: 'right', width: 140 },
            ]}
            leftColumns={["email"]}
            rightColumns={["online"]}
            //rows={this.props.app_users}
            meta={this.props.meta}
            search={this.props.actions.search}
            showUserDrawer={this.showUserDrawer}
            toggleMapView={this.toggleMapView}
            map_view={this.state.map_view}
            enableMapView={true}
          />
        )}

        {this.props.searching && <CircularProgress />}
      </Wrapper>
    );
  }
}

function mapStateToProps(state) {
  const { auth, app, segment, app_users, app_user } = state;
  const { loading, isAuthenticated } = auth;

  const { searching, meta } = app_users;

  return {
    app_user,
    app_users,
    searching,
    meta,
    segment,
    app,
    loading,
    isAuthenticated,
  };
}

export default withRouter(connect(mapStateToProps)(AppContent));
