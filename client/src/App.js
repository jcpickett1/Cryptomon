import React, { Component } from "react";
import CryptomonContract from "./contracts/Nyfti.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CryptomonContract.networks[networkId];
      console.log(deployedNetwork.address);
      const instance = new web3.eth.Contract(
        CryptomonContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods._mint("Tandy").send({ from: accounts[0] });
    // Get the value from the contract to prove it worked.
    var response;
    response = await contract.methods.getStatBlock(0).call();
    // Update state with the result.
    this.setState({ storageValue: response });
  };

  updateValue = async () => {
    const { accounts, contract } = this.state;
    await contract.methods._mint(this.state.newVal).send({ from: accounts[0] });
    let response = await contract.methods.getStatBlock()
    this.setState({ storageValue: response });
    document.getElementById('input').value = '';
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
        <input id="input" onChange={(e) => {this.setState({newVal: e.target.value})}}></input>
        <button onClick={this.updateValue}>Set Stored Value</button>
      </div>
    );
  }
}

export default App;
