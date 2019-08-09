import "./App.css";
import React, { Component } from "react";
import { Row, Col, Container, Alert } from "reactstrap";
import CategoryList from "./components/CategoryList";
import InformationItem from "./components/InformationItem";
import BankList from "./components/BankList";
import cloneDeep from "clone-deep";
import network from "./network";

/**
 * Parent component
 * Manages Data structure and main CRUD functionality of database operations
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      banks: [],
      activeCategory: 0,
      itemIndex: 0,
      isEditingBank: false,
      addTopic: false,
      visible: false
    };
    this.addNewTopic = this.addNewTopic.bind(this);
    this.addNewItem = this.addNewItem.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {
      return true;
    }
    if (this.state.isEditingName && !this.state.isEditingBank) return false;
    if (this.state.isEditingName && this.state.isEditingBank) return true;

    return true;
  }

  /**
   * Initializes application with database information
   */
  componentDidMount() {
    network
      .getBanks()
      .then(response => {
        if (response.data) {
          this.setState({ banks: response.data.flat() });
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({ visible: true });
      });
  }

  /**
   * Adds new item to the currently selected bank
   * @param {object} item Database item in the form of {name: "itemName", content: "<html>content</html>"}
   */
  addNewItem(item) {
    let oldBanks = cloneDeep(this.state.banks);
    oldBanks[this.state.activeCategory].items.push(item);
    network
      .updateTopic(oldBanks[this.state.activeCategory], this.state.banks[this.state.activeCategory]._id)
      .then(() => {
        this.setState({ banks: oldBanks });
      })
      .catch(error => {
        console.log(error);
        this.setState({ visible: true });
      });
  }

  /**
   * Updates the currently selected item in the currently selected bank
   * @param {object} item Database item in the form of {name: "itemName", content: "<html>content</html>"}
   */
  updateItem(item) {
    let oldItems = cloneDeep(this.state.banks);
    oldItems[this.state.activeCategory].items[this.state.itemIndex] = item;
    network
      .updateTopic(oldItems[this.state.activeCategory], this.state.banks[this.state.activeCategory]._id)
      .then(() => {
        this.setState({ banks: oldItems });
      })
      .catch(error => {
        console.log(error);
        this.setState({ visible: true });
      });
  }

  /**
   * Adds new bank to the database and application
   * @param {string} newBankName The name of the new bank being added
   */
  addNewTopic(newBankName) {
    if (newBankName) {
      let newTopic = cloneDeep(this.state.banks); // We have all topics
      let newBankDocument = { bank: newBankName, createdBy: "user", items: [], status: "pending" };
      network
        .addBanks(newBankDocument)
        .then(docID => {
          Object.assign(newBankDocument, { _id: docID.data });
          newTopic.push(newBankDocument);
          this.setState({ banks: newTopic });
        })
        .catch(error => {
          console.log(error);
          this.setState({ visible: true });
        });
    }
  }

  /**
   * Deletes a bank and all its content from the application and database
   */
  deleteBank() {
    let leftOverBanks = cloneDeep(this.state.banks);
    leftOverBanks.splice(this.state.activeCategory, 1);
    network
      .deleteBanks(this.state.banks[this.state.activeCategory]._id)
      .then(() => {
        this.setState({ banks: leftOverBanks });
      })
      .catch(error => {
        console.log(error);
        this.setState({ visible: true });
      });
  }

  /**
   * Deletes the currently selected item from the currently selected bank
   */
  deleteItem() {
    let leftOverTopics = cloneDeep(this.state.banks);
    leftOverTopics[this.state.activeCategory].items.splice(this.state.itemIndex, 1);

    network
      .updateTopic(leftOverTopics[this.state.activeCategory], this.state.banks[this.state.activeCategory]._id)
      .then(docID => {
        this.setState({ banks: leftOverTopics, itemIndex: 0 });
        console.log(docID);
        console.log(this.state.banks[this.state.activeCategory]);
      })
      .catch(error => {
        console.log(error);
        this.setState({ visible: true });
      });
  }

  /**
   * Dismisses any database alerts
   */
  onDismiss() {
    this.setState({ visible: false });
  }

  /**
   * Creates the Alert component with canned message
   */
  alertMe() {
    return (
      <Row>
        <Col>
          <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismiss}>
            Content not saved to database!
          </Alert>
        </Col>
      </Row>
    );
  }

  render() {
    if (this.state.isEditingBank)
      // Displays items from the currently selected bank
      return (
        <Container>
          <Row>
            <Col xs="5">
              <CategoryList
                addNewItem={this.addNewItem}
                updateItem={item => this.updateItem(item)}
                deleteItem={index => this.deleteItem(index)}
                inputOnChange={this.inputOnChange}
                delete={this.state.deleteBank}
                bank={this.state.banks[this.state.activeCategory]}
                back={() => this.setState({ isEditingBank: false })}
                setItem={index => this.setState({ itemIndex: index })}
              />
            </Col>
            <Col xs="7">
              {this.state.banks[this.state.activeCategory].items.length > 0 ? (
                <InformationItem
                  item={this.state.banks[this.state.activeCategory].items[this.state.itemIndex]}
                  updateItem={itemChanges => this.updateItem(itemChanges)}
                />
              ) : null}
            </Col>
          </Row>

          {this.alertMe()}
        </Container>
      );
    // Selects a bank to inspect
    else
      return (
        <BankList
          activeCategory={this.state.activeCategory}
          setActiveCategory={category => {
            this.setState({ activeCategory: category });
          }}
          banks={this.state.banks}
          setBanks={banks => {
            this.setState({ banks: banks });
          }}
          setEditingBank={() => {
            this.setState({ isEditingBank: true });
          }}
          deleteBank={() => {
            this.deleteBank();
          }}
          addNewTopic={newTopicName => {
            this.addNewTopic(newTopicName);
          }}
        />
      );
  }
}

export default App;
