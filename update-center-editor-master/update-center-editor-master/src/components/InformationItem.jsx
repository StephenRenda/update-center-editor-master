import React, { Component } from "react";
import { Row, Col, Button, Jumbotron } from "reactstrap";
import ReactQuill from "react-quill"; // ES6
import "react-quill/dist/quill.snow.css";

/**
 * Displays HTML content from an item within a bank
 * Provides editing functionality to users
 */
class InformationItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false
    };
    this.newContent = "";
    this.setContent = this.setContent.bind(this);
  }

  /**
   * Initializes Quill
   */
  componentDidMount() {
    if (this.props.item) {
      this.setContent();
    }
  }

  /**
   * Updates Quill when changes are made
   */
  componentDidUpdate() {
    if (this.props.item) {
      this.setContent();
    }
  }

  /**
   * Breaks virtual DOM, but necessary to use the React-Quill editor
   * Sets React-Quill DOM content
   */
  setContent() {
    let div = document.getElementById("bank");
    if (div) {
      div.innerHTML = this.props.item.content;
    }
  }

  render() {
    return (
      <Jumbotron id="informationItem">
        <Row>{<h1 className="display-6">{this.props.item.name}</h1>}</Row>

        <Row>
          <Col sm={{ size: 2, offset: 10 }}>
            {this.state.isEditing ? (
              <Button
                color="primary"
                onClick={() => {
                  this.setState({ isEditing: false });
                  this.props.updateItem({ name: this.props.item.name, content: this.newContent });
                  console.log(this.newContent);
                }}
                // updateBank={() => {
                //   this.props.updateBank;

                // }}
              >
                Save
              </Button>
            ) : (
              <Button
                color="primary"
                onClick={() => {
                  this.setState({ isEditing: true });
                }}
              >
                Edit
              </Button>
            )}
          </Col>
        </Row>
        <br />
        <link rel="stylesheet" href="//cdn.quilljs.com/1.2.6/quill.snow.css" />
        <Row>
          <Col style={{ backgroundColor: "white", color: "black", padding: "0" }}>
            {this.state.isEditing ? (
              <ReactQuill
                id="quill-wrapper"
                value={this.props.item.content}
                onChange={value => {
                  this.newContent = value;
                  console.log(value);
                }}
                theme="snow"
              />
            ) : (
              <div id="bank" />
            )}
          </Col>
        </Row>
      </Jumbotron>
    );
  }
}

export default InformationItem;
