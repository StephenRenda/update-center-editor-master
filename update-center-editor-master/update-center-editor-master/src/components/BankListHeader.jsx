import React, { Component } from "react";
import { Row, Col, InputGroup, InputGroupAddon, Input, Button } from "reactstrap";
import uuid from "uuid/v4";

/**
 * The header of the BankList component
 * Contains the title of the bank and an Add Bank button that allows users to add more banks to the list
 */
class BankListHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onNewBankSaveClick = this.onNewBankSaveClick.bind(this);
  }

  /**
   * Executed when the 'save' button is pressed when adding a new bank
   */
  onNewBankSaveClick() {
    this.setState({ addTopic: false });
    this.props.addNewTopic(this.newBankName);
    this.newBankName = "";
  }

  /**
   * Makes the 'save' button available for the user to press when creating a new bank
   */
  makeSaveButton() {
    return (
      <InputGroup>
        <Input
          key={uuid()}
          placeholder={"Topic Name"}
          style={{ display: "block", margin: "auto", width: "50%" }}
          onChange={event => {
            this.newBankName = event.target.value;
          }}
        />
        <InputGroupAddon addonType="append">
          <Button
            style={{ backgroundColor: "#fdb81e", color: "black", border: "none" }}
            onClick={this.onNewBankSaveClick}
          >
            Save
          </Button>
        </InputGroupAddon>
      </InputGroup>
    );
  }

  /**
   * Makes the 'add' button available for the user to add new banks to the list
   */
  makeAddButton() {
    return (
      <Button
        color="info"
        onClick={() => {
          this.state.addTopic ? this.setState({ addTopic: false }) : this.setState({ addTopic: true });
        }}
        block
      >
        Add
      </Button>
    );
  }

  render() {
    return (
      <>
        <Row>
          <Col xs="12">
            <h1 id="landingPage" className="display-6" style={{ width: "100%" }}>
              Update Center Topics
            </h1>
          </Col>
        </Row>
        <Row xs="7">{this.state.addTopic ? this.makeSaveButton() : this.makeAddButton()}</Row>
      </>
    );
  }
}

export default BankListHeader;
