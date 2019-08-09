import React, { Component } from "react";
import { Container, Row, Col, Jumbotron, ListGroup, ListGroupItem, Input, Button, Alert } from "reactstrap";
import BankListHeader from "./BankListHeader";
import uuid from "uuid/v4";
import network from "../network";
import cloneDeep from "clone-deep";

// Delete button (x) style
const btnStyle = {
  background: "transparent",
  color: "black",
  border: "none",
  padding: "5px 9px",
  borderRadius: "50%",
  cursor: "pointer",
  float: "right"
};

/**
 * List of Banks that, when clicked, redirect the user to the items within the bank
 */
class BankList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertVisible: false
    };

    this.onActiveBankClick = this.onActiveBankClick.bind(this);
    this.onEditSaveClick = this.onEditSaveClick.bind(this);
    this.inputOnChange = this.inputOnChange.bind(this);
    this.onDismissAlert = this.onDismissAlert.bind(this);
  }

  /**
   * When a highlighted bank is clicked, redirects the user to the items within the bank
   */
  onActiveBankClick() {
    this.props.setEditingBank();
  }

  /**
   * Saves the value of the new bank name input form
   */
  inputOnChange(event) {
    this.newBankName = event.target.value;
  }

  /**
   * Writes changes to the database when a user is finished editing a bank name
   */
  onEditSaveClick(event) {
    event.stopPropagation();
    this.setState({ isEditingName: false });
    let newBanks = cloneDeep(this.props.banks);
    newBanks[this.props.activeCategory].bank = this.newBankName;
    network
      .updateBankName(newBanks[this.props.activeCategory], newBanks[this.props.activeCategory]._id)
      .then(() => {
        this.props.setBanks(newBanks);
      })
      .catch(error => {
        console.log(error);
        this.setState({ alertVisible: true });
      });
  }

  /**
   * Dismisses alert when the user presses (x) in the alert
   */
  onDismissAlert() {
    this.setState({ alertVisible: false });
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <Jumbotron>
              <BankListHeader addNewTopic={this.props.addNewTopic} />
              {/* List of banks */}
              <ListGroup>
                {this.props.banks.map((bank, index) => {
                  if (index === this.props.activeCategory) {
                    //   Active Bank
                    return (
                      <ListGroupItem key={uuid()} active tag="a" href="#" action onClick={this.onActiveBankClick}>
                        <Row />
                        <Row>
                          <Col xs="7">
                            {this.state.isEditingName ? (
                              <Input
                                key={uuid()}
                                defaultValue={bank.bank}
                                onClick={event => {
                                  event.stopPropagation();
                                }}
                                onChange={this.inputOnChange}
                              />
                            ) : (
                              bank.bank
                            )}
                          </Col>
                          <Col>
                            {this.state.isEditingName ? (
                              <Button onClick={this.onEditSaveClick} style={btnStyle}>
                                save
                              </Button>
                            ) : (
                              <Button
                                onClick={event => {
                                  event.stopPropagation();
                                  this.setState({ isEditingName: true });
                                }}
                                style={btnStyle}
                              >
                                edit
                              </Button>
                            )}

                            <Button
                              onClick={event => {
                                event.stopPropagation();
                                this.props.deleteBank();
                              }}
                              style={btnStyle}
                            >
                              x
                            </Button>
                          </Col>
                        </Row>
                      </ListGroupItem>
                    );
                  } else {
                    // Inactive Banks
                    return (
                      <ListGroupItem
                        key={uuid()}
                        tag="a"
                        href="#"
                        action
                        onClick={() => this.props.setActiveCategory(index)}
                      >
                        {bank.bank}
                      </ListGroupItem>
                    );
                  }
                })}
              </ListGroup>
            </Jumbotron>
          </Col>
        </Row>
        <Row>
          <Col>
            <Alert color="danger" isOpen={this.state.alertVisible} toggle={this.onDismissAlert}>
              Content not saved to database!
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default BankList;
