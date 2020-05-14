import React, { Component } from "react";
import graphql from "../../graphql/client";
import { UPDATE_CAMPAIGN, DELIVER_CAMPAIGN } from "../../graphql/mutations";
import TextEditor from "../../textEditor";
import styled from "@emotion/styled";
import { ThemeProvider } from "emotion-theming";
import theme from "../../textEditor/theme";
import EditorContainer from "../../textEditor/editorStyles";
import StatusBadge from '../../components/StatusBadge';

const ButtonsContainer = styled.div`
  display: flex;
  direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  float: right;
  margin: 4px 4px;
`;

const ButtonsRow = styled.div`
  align-self: flex-end;
  clear: both;
  margin: 0px;
  button {
    margin-right: 2px;
  }
`;

const BrowserSimulator = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  background: #fafafa;
  border: 1px solid #dde1eb;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  max-width: 680px;
  margin: auto;
  margin-top: 50px;
  margin-bottom: 50px;
`;
const BrowserSimulatorHeader = styled.div`
  background: rgb(250, 247, 242);
  border-bottom: 1px solid #ececec;
  padding: 16px;
  display: flex;
`;
const BrowserSimulatorButtons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 74px;

  .r {
    width: 30px;
    height: 6px;
    margin-right: 6px;
    border-radius: 4px;
    background-color: #fc635e;
    border: 1px solid #dc4441;
  }
  .y {
    width: 30px;
    height: 6px;
    margin-right: 6px;
    border-radius: 4px;
    background-color: #fdbc40;
    border: 1px solid #db9c31;
  }
  .g {
    width: 30px;
    height: 6px;
    margin-right: 6px;
    border-radius: 4px;
    background-color: #35cd4b;
    border: 1px solid #24a732;
  }
`;

const EditorPad = styled.div`
  ${(props) =>
    props.mode === "user_auto_messages"
      ? ` display:flex;
      justify-content: flex-end;
      flex-flow: column;
      height: 90vh;

      .postContent {
        height: 440px;
        overflow: auto;
      }
    `
      : `
      padding: 2em;
      background-color: white;

      @media all and (min-width: 1024px) and (max-width: 1280px) {
        margin: 8em;
      }

      @media (max-width: 640px){
        margin: 2em;
      }
      
    `}
`;

const EditorContentWrapper = styled.div`
  padding: 0 50 50px;
  border: solid 1px rgba(0,0,0,0.12);
  border-radius: 4px;
`;

const EditorMessengerEmulator = styled.div`
  ${(props) =>
    props.mode === "user_auto_messages"
      ? `
  display:flex;
  justify-content: flex-end;`
      : ``}
`;

const EditorMessengerEmulatorWrapper = styled.div`
  ${(props) =>
    props.mode === "user_auto_messages"
      ? `width: 380px;
    background: #fff;
    border: 1px solid #f3efef;
    margin-bottom: 25px;
    margin-right: 20px;
    box-shadow: 3px 3px 4px 0px #b5b4b4;
    border-radius: 10px;
    padding: 12px;
    padding-top: 0px;
    .icon-add{
      margin-top: -2px;
      margin-left: -2px;
    }
    `
      : ``}
`;

const EditorMessengerEmulatorHeader = styled.div`
  ${(props) =>
    props.mode === "user_auto_messages"
      ? `
  padding: 1em;
  border-bottom: 1px solid #ccc;
  `
      : ``}
`;

export default class CampaignEditor extends Component {
  constructor(props) {
    super(props);

    this.ChannelEvents = null;
    this.conn = null;
    this.menuResizeFunc = null;
    this.state = {
      loading: true,
      currentContent: null,
      diff: "",
      videoSession: false,
      selectionPosition: null,
      incomingSelectionPosition: [],
      data: {},
      status: "",
      read_only: false,
      statusButton: "inprogress",
    };
  }

  saveContent = (content) => {
    if (this.props.data.serializedContent === content.serialized) return;

    this.setState({
      status: "saving...",
      statusButton: "success",
    });

    const params = {
      appKey: this.props.app.key,
      id: this.props.data.id,
      campaignParams: {
        html_content: content.html,
        serialized_content: content.serialized,
      },
    };

    graphql(UPDATE_CAMPAIGN, params, {
      success: (data) => {
        this.props.updateData(data.campaignUpdate.campaign, null);
        this.setState({ status: "saved" });
      },
      error: () => {},
    });
  };

  saveHandler = (html3, plain, serialized) => {
    debugger;
  };

  uploadHandler = ({ serviceUrl, imageBlock }) => {
    imageBlock.uploadCompleted(serviceUrl);
  };

  handleSend = (e) => {
    const params = {
      appKey: this.props.app.key,
      id: this.props.data.id,
    };

    graphql(DELIVER_CAMPAIGN, params, {
      success: (data) => {
        this.props.updateData(data.campaignDeliver.campaign, null);
        this.setState({ status: "saved" });
      },
      error: () => {},
    });
  };

  render() {
    // !this.state.loading &&
    /*if (this.state.loading) {
      return <Loader />
    }*/

    return (
      <EditorContentWrapper mode={this.props.mode}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, padding: '20px 40px', borderBottom: 'solid 1px rgba(0,0,0,.125)'}}>
          <span>Create your message</span>
          <StatusBadge type="outline" style={{cursor: 'pointer'}}>
            &nbsp;&nbsp;Edit&nbsp;&nbsp;
          </StatusBadge>
        </div>

        <BrowserSimulator mode={this.props.mode}>
          <BrowserSimulatorHeader>
            <BrowserSimulatorButtons>
              <div className={"circleBtn r"}></div>
              <div className={"circleBtn y"}></div>
              <div className={"circleBtn g"}></div>
            </BrowserSimulatorButtons>
          </BrowserSimulatorHeader>

          <EditorPad mode={this.props.mode}>
            <EditorMessengerEmulator mode={this.props.mode}>
              <EditorMessengerEmulatorWrapper mode={this.props.mode}>
                <EditorMessengerEmulatorHeader mode={this.props.mode} />

                <TextEditor
                  campaign={true}
                  uploadHandler={this.uploadHandler}
                  serializedContent={this.props.data.serializedContent}
                  read_only={this.state.read_only}
                  toggleEditable={() => {
                    this.setState({ read_only: !this.state.read_only });
                  }}
                  data={{
                    serialized_content: this.props.data.serializedContent,
                  }}
                  styles={{
                    lineHeight: "2em",
                    fontSize: "1.2em",
                  }}
                  saveHandler={this.saveHandler}
                  updateState={({ status, statusButton, content }) => {
                    console.log("get content", content);
                    this.saveContent(content);
                  }}
                />
              </EditorMessengerEmulatorWrapper>
            </EditorMessengerEmulator>
          </EditorPad>
        </BrowserSimulator>
      </EditorContentWrapper>
    );
  }
}
