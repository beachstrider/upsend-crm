import React, { Component } from "react";

import PieChartIcon from "@material-ui/icons/PieChart";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import FormatQuoteIcon from "@material-ui/icons/FormatQuote";
import DateRangeIcon from "@material-ui/icons/DateRange";
import ExposurePlus2Icon from "@material-ui/icons/ExposurePlus2";
import FormDialog from "../FormDialog";
import DataTable from "../table/index";

import SegmentItemButton from "./itemButton";
import { Map, List, fromJS } from "immutable";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";

import defaultFields from "../../shared/defaultFields";
import styled from "@emotion/styled";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import icon_plus from "../../icons/bx-plus.svg";
import icon_save from "../../icons/bx-save.svg";
import icon_delete from "../../icons/bxs-trash.svg";

const ContentMatchTitle = styled.h5`
  margin: 15px;
  border-bottom: 2px solid #6f6f6f;
`;

const ContentMatch = styled.div`
  overflow: auto;
  width: 300px;
  height: 121px;
  margin-bottom: 25px;
  padding-left: 14px;
`;

const ContentMatchFooter = styled.div`
  /* position: absolute; */
  bottom: 0px;
  width: 100%;
  left: 0px;
  padding: 9px;
  /* background: #ccc; */
  margin-top: 10px;
  border-top: 1px solid #ccc;
  display: flex;
  align-items: baseline;
`;

const ButtonGroup = styled.div`
  //display: inline-flex;
  //display: -webkit-box;

  margin-bottom: 2em;

  display: inline-flex;
  flex-wrap: wrap;

  button {
    margin-right: 5px !important;
    margin: 2px;
  }
`;

export class SaveSegmentModal extends Component {
  state = {
    isOpen: false,
    action: "update",
    loading: false,
    input: null,
  };
  open = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });
  input_ref = null;

  secondaryAction = ({ target }) => {
    this.props.savePredicates(
      {
        action: this.state.action,
        input: this.input_ref ? this.input_ref.value : null,
      },
      () => {
        this.close();
        if (this.props.predicateCallback) this.props.predicateCallback();
      }
    );
  };

  deleteAction = ({ target }) => {
    this.props.deleteSegment(this.props.segment.id, this.close);
  };

  handleChange = ({ target }) => {
    this.setState({
      action: target.value,
    });
  };

  equalPredicates = () => {
    return fromJS(this.props.segment.predicates).equals(
      fromJS(this.props.segment.initialPredicates)
    );
  };

  incompletePredicates = () => {
    return this.props.segment.predicates.find((o) => !o.comparison || !o.value);
  };

  render() {
    const { isOpen, loading } = this.state;

    return (
      <React.Fragment>
        <div>
          <Button
            isLoading={false}
            color="primary"
            onClick={this.open}
            disabled={this.equalPredicates() || this.incompletePredicates()}
          >
            &nbsp;&nbsp;&nbsp;
            <img src={icon_save} style={{ height: "20px" }} />
            &nbsp;&nbsp;Save segment&nbsp;&nbsp;&nbsp;
          </Button>

          <Button
            isLoading={false}
            color="primary"
            onClick={this.deleteAction.bind(this)}
          >
            &nbsp;&nbsp;&nbsp;
            <img src={icon_delete} style={{ height: "20px" }} />
            &nbsp;&nbsp;Delete segment&nbsp;&nbsp;&nbsp;
          </Button>
        </div>

        {isOpen && (
          <FormDialog
            open={isOpen}
            //contentText={"lipsum"}
            titleContent={"Save Segment"}
            formComponent={
              !loading ? (
                <div>
                  <RadioGroup
                    aria-label="options"
                    name="options"
                    onChange={this.handleChange.bind(this)}
                  >
                    <FormControlLabel
                      control={<Radio />}
                      value="update"
                      label={`Save changes to the segment ‘${this.props.segment.name}’`}
                    />
                    <FormControlLabel
                      control={<Radio />}
                      value="new"
                      label="Create new segment"
                    />
                  </RadioGroup>

                  {this.state.action === "new" ? (
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      name="name"
                      label="name"
                      type="email"
                      ref={"input"}
                      fullWidth
                      inputRef={(input) => (this.input_ref = input)}
                    />
                  ) : null}

                  {/*
                      actions.map((o, i)=> (
                        <Button key={i}
                          onClick={o.onClick}>
                          {o.text}
                        </Button>
                       )
                      )
                      */}
                </div>
              ) : (
                <Spinner />
              )
            }
            dialogButtons={
              <React.Fragment>
                <Button onClick={this.close} color="secondary">
                  Cancel
                </Button>

                <Button
                  onClick={this.secondaryAction.bind(this)}
                  color="primary"
                >
                  {this.state.action === "update" ? "Save" : "Save New"}
                </Button>
              </React.Fragment>
            }
            //actions={actions}
            //onClose={this.close}
            //heading={this.props.title}
          ></FormDialog>
        )}
      </React.Fragment>
    );
  }
}

export class InlineFilterDialog extends Component {
  state = {
    dialogOpen: false,
    filterSearch: "",
  };

  _my_field = null;

  toggleDialog = (e) =>
    this.setState({
      dialogOpen: !this.state.dialogOpen,
      filterSearch: "",
    });

  handleClick = (e, o) => {
    this.setState(
      {
        dialogOpen: !this.state.dialogOpen,
      },
      () => {
        this.props.addPredicate(o, (token) => {
          //this.props.handleClick(token)
        });
      }
    );
  };

  toggleDialog2 = () => {
    this.setState({ dialogOpen: !this.state.dialogOpen });
  };

  availableFields = () => {
    if (!this.props.app.customFields) return defaultFields;
    return this.props.app.customFields.concat(defaultFields);
  };

  handleFilterSearchChange = (e) => {
    this.setState({ filterSearch: e.target.value });
  };

  filterMenuItem = (fieldObject) => {
    let IconTag = FormatQuoteIcon;
    if (fieldObject.type == "date") {
      IconTag = DateRangeIcon;
    } else if (fieldObject.type == "number") {
      IconTag = ExposurePlus2Icon;
    }

    return (
      <span style={{ display: "inline-flex", alignItems: "center" }}>
        <IconTag variant="small" style={{ marginRight: "10px" }} />
        {fieldObject.name}
      </span>
    );
  };

  render() {
    const fields = this.availableFields();
 
    const content = (
      <ClickAwayListener onClickAway={this.toggleDialog2.bind(this)}>
        <div>
          <Input
            placeholder="Search people and company data."
            onChange={this.handleFilterSearchChange}
            endAdornment={
              <InputAdornment position="start">
                <SearchIcon size="small" />
              </InputAdornment>
            }
          />

          <div className="list-scroll-menu" style={{ height: "500px", width: "360px", overflow: "auto" }}>
            {fields
              .filter((v) => {
                return (
                  v.name
                    .toLowerCase()
                    .indexOf(this.state.filterSearch.toLowerCase()) > -1
                );
              })
              .map((o) => (
                <MenuItem
                  key={o.name}
                  onClick={(e) => this.handleClick.bind(this)(e, o)}
                >
                  {this.filterMenuItem(o)}
                </MenuItem>
              ))}
          </div>

          <Button
            className="btn-bottom-new"
            variant="contained"
          >
            <img src={icon_plus} style={{ height: "20px" }} />
            &nbsp;&nbsp;New attribute
          </Button>
        </div>
      </ClickAwayListener>
    );

    return (
      <div>
        <Button
          innerRef={(ref) => (this._my_field = ref)}
          isLoading={false}
          variant="contained"
          onClick={this.toggleDialog}
        >
          &nbsp;&nbsp;&nbsp;
          <img src={icon_plus} style={{ height: "20px" }} />
          &nbsp;&nbsp;Add filter&nbsp;&nbsp;&nbsp;
        </Button>

        <Menu
          anchorEl={this._my_field}
          open={this.state.dialogOpen}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          {content}
        </Menu>
      </div>
    );
  }
}

class SegmentManager extends Component {
  constructor(props) {
    super(props);
  }

  handleClickOnSelectedFilter = (jwtToken) => {
    const url = `/apps/${this.props.app.key}/segments/${this.props.store.segment.id}/${jwtToken}`;
    //this.props.history.push(url)
  };

  getTextForPredicate = (o) => {
    if (o.type === "match") {
      return `Match ${o.value === "and" ? "all" : "any"} criteria`;
    } else {
      return `Match: ${o.attribute} ${o.comparison ? o.comparison : ""} ${
        o.value ? o.value : ""
      }`;
    }
  };

  render() {
    // this.props.actions.getPredicates()
    return (
      <Box mt={2}>
        <ButtonGroup>
          {this.props.predicates.map((o, i) => {
            return (
              <SegmentItemButton
                key={i}
                index={i}
                predicates={this.props.predicates}
                predicate={o}
                open={!o.comparison}
                appearance={o.comparison ? "primary" : "default"}
                text={this.getTextForPredicate(o)}
                updatePredicate={this.props.updatePredicate}
                deletePredicate={this.props.deletePredicate}
              />
            );
          })}

          <InlineFilterDialog
            {...this.props}
            app={this.props.app}
            addPredicate={this.props.addPredicate}
            handleClick={this.handleClickOnSelectedFilter.bind(this)}
          />

          {this.props.children}
        </ButtonGroup>

        {
          <DataTable
            title={"segment"}
            meta={this.props.meta}
            data={this.props.collection}
            search={this.props.search}
            loading={this.props.loading}
            columns={this.props.columns}
            defaultHiddenColumnNames={this.props.defaultHiddenColumnNames}
            tableColumnExtensions={this.props.tableColumnExtensions}
            leftColumns={this.props.leftColumns}
            rightColumns={this.props.rightColumns}
            toggleMapView={this.props.toggleMapView}
            map_view={this.props.map_view}
            enableMapView={this.props.enableMapView}
          />
        }
      </Box>
    );
  }
}

function mapStateToProps(state) {
  const { app } = state;
  return {
    app,
  };
}

export default withRouter(connect(mapStateToProps)(SegmentManager));
