import React, { Component } from "react";
import Moment from "react-moment";
import CampaignChart from "./charts/charts.js";
import styled from "@emotion/styled";
import graphql from "../graphql/client";
import { Datatable } from "../components/datatable/";
import gravatar from "../shared/gravatar";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";

import Count from "./charts/count";
import { withStyles } from "@material-ui/styles";

const PieContainer = styled.div`
  padding: 0.75em;
  display: grid;
  grid-template-columns: repeat(4, 200px);
  grid-gap: 10px;
  width: 100vw;
  margin: 25px 0 18px 0;
  overflow: auto;
`;

const PieItem = styled.div`
  height: 200px;
`;

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  margin-right: 8px;
`;

const styles = (theme) => ({
  cardPaper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
});

class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: [],
      meta: {},
      counts: {},
      loading: false,
      visible_cols: ["email", "action", "host", "createdAt", "data"],
      selected_rows: [],
    };
    this.getData = this.getData.bind(this);
  }

  createHead = (withWidth) => {
    return [
      {
        field: "action",
        options: {
          filter: false,
          render: (value, tableMeta, updateValue) => {
            return this.renderLozenge(value);
          },
        },
      },

      {
        field: "email",
        options: {
          filter: false,
        },
      },
      {
        field: "host",
        options: {
          filter: false,
        },
      },

      {
        field: "created_at",
        options: {
          filter: false,
        },
      },

      {
        field: "data",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            return <p>cccc</p>;
          },
        },
      },
    ];
  };

  renderLozenge = (item) => {
    let kind = "default";

    switch (item) {
      case "click":
        kind = "success";
        break;
      case "viewed":
        kind = "inprogress";
        break;
      case "close":
        kind = "removed";
        break;
      default:
        break;
    }

    return <div appearance={kind}>{item}</div>;
  };

  componentDidMount() {
    this.init();
  }

  init = () => {
    this.getData();
    //this.getCounts()
  };

  getData = () => {
    this.props.getStats(
      {
        appKey: this.props.app.key,
        mode: this.props.mode,
        id: this.props.match.params.id,
        page: this.state.meta.next_page || 1,
      },
      (data) => {
        const { counts, metrics } = data;
        this.setState({
          meta: metrics.meta,
          counts: counts,
          collection: metrics.collection,
        });
      }
    );
  };

  handleNextPage = () => {
    this.getData();
  };

  getRateFor = (type) => {
    return type.keys.map((o) => {
      return {
        id: o.name,
        label: o.name,
        value: this.state.counts[o.name] || 0,
        color: o.color,
      };
    });
  };

  render() {
    const { classes } = this.props;
    const columns = [
      {
        name: "Email",
        selector: "email",
        sortable: true,
        width: "260px",
        omit: this.state.visible_cols.indexOf("email") === -1,
      },
      {
        name: "Action",
        selector: "action",
        sortable: true,
        width: 260,
        omit: this.state.visible_cols.indexOf("action") === -1,
      },
      {
        name: "From",
        selector: "host",
        sortable: true,
        omit: this.state.visible_cols.indexOf("host") === -1,
      },
      {
        name: "When",
        selector: "createdAt",
        sortable: true,
        omit: this.state.visible_cols.indexOf("createdAt") === -1,
        cell: (row) =>
          row ? <Moment fromNow>{row.updatedAt}</Moment> : undefined,
      },
      {
        name: "Data",
        selector: "data",
        sortable: true,
        omit: this.state.visible_cols.indexOf("data") === -1,
        cell: (row) => (row ? <p>{JSON.stringify(row.data)}</p> : null),
      },
    ];

    return (
      <div>
        {!this.props.mode === "counter_blocks" && (
          <PieContainer>
            {this.props.data &&
              this.props.data.statsFields.map((o) => {
                return (
                  <PieItem>
                    <CampaignChart data={this.getRateFor(o)} />
                  </PieItem>
                );
              })}
          </PieContainer>
        )}

        {this.props.mode === "counter_blocks" && this.props.data && (
          <Grid container spacing={3}>
            {Object.keys(this.state.counts).map((key) => {
              return (
                <Grid item xs={6} md={3}>
                  <Paper className={classes.cardPaper}>
                    <Count
                      data={this.state.counts[key]}
                      label={key}
                      appendLabel={""}
                    />
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Divider variant={"fullWidth"} />

        {!this.state.loading ? (
          // <Table
          //   data={this.state.collection}
          //   loading={this.props.searching}
          //   search={this.getData}
          //   defaultHiddenColumnNames={[]}
          //   columns={[
          //     { field: "id", title: "id", hidden: true },
          //     {
          //       field: "email",
          //       title: "email",
          //       render: (row) =>
          //         row ? (
          //           <NameWrapper
          //             onClick={(e) =>
          //               this.props.actions.showUserDrawer(row.appUserId)
          //             }
          //           >
          //             <AvatarWrapper>
          //               <Badge
          //                 //className={classes.margin}
          //                 color={row.online ? "primary" : "secondary"}
          //                 variant="dot"
          //               >
          //                 <Avatar
          //                   name={row.email}
          //                   size="medium"
          //                   src={gravatar(row.email)}
          //                 />
          //               </Badge>
          //             </AvatarWrapper>

          //             <Typography>{row.email}</Typography>
          //             <Typography variant="overline" display="block">
          //               {row.name}
          //             </Typography>
          //           </NameWrapper>
          //         ) : undefined,
          //     },
          //     { field: "action", title: "Action" },
          //     { field: "host", title: "from" },
          //     {
          //       field: "createdAt",
          //       title: "when",
          //       render: (row) =>
          //         row ? <Moment fromNow>{row.updatedAt}</Moment> : undefined,
          //     },
          //     {
          //       field: "data",
          //       title: "data",
          //       render: (row) =>
          //         row ? <p>{JSON.stringify(row.data)}</p> : null,
          //     },
          //   ]}
          //   //selection [],
          //   tableColumnExtensions={[
          //     //{ columnName: 'id', width: 150 },
          //     { columnName: "email", width: 250 },
          //     { columnName: "lastVisitedAt", width: 120 },
          //     { columnName: "os", width: 100 },
          //     { columnName: "osVersion", width: 100 },
          //     { columnName: "state", width: 80 },
          //     { columnName: "online", width: 80 },

          //     //{ columnName: 'amount', align: 'right', width: 140 },
          //   ]}
          //   leftColumns={["email"]}
          //   rightColumns={["online"]}
          //   meta={this.state.meta}
          // />
          <Datatable
            columns={columns}
            data={this.state.collection}
            pagination
            onSelectedRowsChange={(s) =>
              this.setState({ selected_rows: s.selectedRows })
            }
          />
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(Stats);
