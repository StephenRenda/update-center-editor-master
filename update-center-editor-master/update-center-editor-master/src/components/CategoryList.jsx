import React, { Component } from "react";
import { Row, Col, Button, Jumbotron, ListGroup, ListGroupItem, InputGroup, Input, InputGroupAddon } from "reactstrap";

// Preferred style for (x) buttons
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
 * Lists items within a bank
 * Provides CRUD operations on items within a bank
 */
class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCategory: 0,
      ifEditTopic: false
    };
    this.newItemTopicName = "";
    this.updateTopicName = "";
  }

  render() {
    return (
      // Category List header
      <Jumbotron id="categoryList">
        <h1 className="display-5">{this.props.bank.bank} Update Center</h1>
        <Row>
          <Col xs="4">
            <Button color="info" onClick={() => this.props.back()} block>
              ← Back
            </Button>
          </Col>
          <Col xs="3" style={{ justifyContent: "center", alignItems: "center" }} />
          <Col xs="5" style={{ position: "absolute", right: 30 }}>
            {this.state.addTopic ? (
              <InputGroup>
                <Input
                  placeholder={"Topic Name"}
                  style={{ display: "block", margin: "auto", width: "50%" }}
                  onChange={event => {
                    this.newItemTopicName = event.target.value;
                  }}
                />
                <InputGroupAddon addonType="append">
                  <Button
                    style={{ backgroundColor: "#fdb81e", color: "black", border: "none" }}
                    onClick={() => {
                      this.setState({ addTopic: false });
                      this.props.addNewItem({ name: this.newItemTopicName, content: "" });
                      this.newItemTopicName = "";
                    }}
                  >
                    Save
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            ) : (
              <Button
                color="info"
                onClick={() => {
                  this.state.addTopic ? this.setState({ addTopic: false }) : this.setState({ addTopic: true });
                }}
                block
              >
                Add
              </Button>
            )}
          </Col>
        </Row>

        {/* Category List item list information */}
        <ListGroup>
          {this.props.bank.items.map((item, index) => {
            // If its the selected item, highlight it and display the x and edit buttons
            if (index === this.state.activeCategory) {
              return (
                <ListGroupItem key={item + index} active tag="a" href="#" action>
                  <Button
                    onClick={event => {
                      event.stopPropagation();
                      this.props.deleteItem();
                    }}
                    style={btnStyle}
                  >
                    x
                  </Button>

                  {this.state.ifEditTopic ? (
                    <Input
                      defaultValue={item.name}
                      onChange={event => {
                        this.updateTopicName = event.target.value;
                      }}
                    />
                  ) : (
                    item.name
                  )}
                  {this.state.ifEditTopic ? (
                    <Button
                      onClick={() => {
                        this.setState({ ifEditTopic: false });
                        this.props.updateItem({ name: this.updateTopicName, content: item.content });
                      }}
                      style={btnStyle}
                    >
                      save
                    </Button>
                  ) : (
                    <Button
                      onClick={event => {
                        event.stopPropagation();
                        this.setState({ ifEditTopic: true });
                      }}
                      style={btnStyle}
                    >
                      edit
                    </Button>
                  )}
                </ListGroupItem>
              );
              // Else if its any other item, display it normally
            } else {
              return (
                <ListGroupItem
                  key={item + index}
                  tag="a"
                  href="#"
                  action
                  onClick={() => {
                    this.setState({ activeCategory: index });
                    this.props.setItem(index);
                  }}
                >
                  {item.name}
                </ListGroupItem>
              );
            }
          })}
        </ListGroup>
        <br />
      </Jumbotron>
    );
  }
}

export default CategoryList;
