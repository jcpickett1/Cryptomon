import React, { Component } from "react";
import CryptomonContract from "./contracts/Nyfti.json";
import getWeb3 from "./getWeb3";
import Arena from './components/Arena';

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
      const instance = new web3.eth.Contract(
        CryptomonContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      this.computeTurn = this.computeTurn.bind(this);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState(
        { web3,
          accounts,
          contract: instance,
          nyftiList: [],
          battlePlayer: {},
          battleOpponent: {}
        }, this.runExample);
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
    let resp1 = {
      name: response.name,
      index: response.index,
      health: response.health,
      currHealth: response.currHealth,
      speed: response.speed,
      attackPower: response.attackPower,
    }
    response = await contract.methods.getStatBlock(1).call();
    let resp2 = {
      name: response.name,
      index: response.index,
      health: response.health,
      currHealth: response.currHealth,
      speed: response.speed,
      attackPower: response.attackPower,
    }
    // Update state with the result.
    this.setState({ storageValue: response, battlePlayer: resp1, battleOpponent: resp2 });
  };

  updateValue = async () => {
    const { accounts, contract } = this.state;
    await contract.methods._mint(this.state.newVal).send({ from: accounts[0] });
    let response = await contract.methods.getStatsList().call();
    this.setState({ nyftiList: response });
    document.getElementById('input').value = '';
  };

  computeTurn = async (playerAction) => {
    //Player action coded as integer. 1 Attack 2 Defend 3 Run
    switch(playerAction) {
      case 1:
        {
          const mult = Math.random() + 0.5;
          let dmg = mult * this.state.battlePlayer.attackPower;
          let ref = this.state.battleOpponent;
          if(this.state.battleOpponent.guarded) {
            dmg = dmg * 0.5;
            this.state.battleOpponent.guarded = false;
          }
          console.log("opponent", ref);
          console.log("damage", dmg);
          ref.currHealth -= dmg;
          console.log("outcome", ref.currHealth);
          this.setState({ battleOpponent: ref });
        }
        break;
      case 2:
        {
          let ref = this.state.battlePlayer;
          ref.guarded = true;
          this.setState({ battlePlayer: ref });
        }
        break;
      case 3:
        {
          let quotient = this.state.battlePlayer.speed / (this.state.battleOpponent.speed + 100);
          if(Math.random() <= quotient) {
            this.setState({ battleOpponent: {} });
          }
        }
        break;
      default:
        {
          let quotient = this.state.battlePlayer.speed / (this.state.battleOpponent.speed + 100);
          if(Math.random() <= quotient) {
            this.setState({ battlePlayer: {}, battleOpponent: {} });
          }
        }
        break;

    }
    if(this.state.battleOpponent.currHealth <= 0 || !this.state.battleOpponent.currHealth) {
      this.setState({ battleOpponent: {} });
      return;
    }
    if(Math.random >= 0.5) {
      const mult = Math.random() + 0.5;
      let ref = this.state.battlePlayer;
      let dmg = mult * ref.attackPower;
      console.log("player", ref);
      if(ref.guarded) {
        dmg = dmg * 0.5;
        ref.guarded = false;
      }
      console.log("damage", dmg);
      ref.currHealth -= dmg;
      
      console.log("outcome", ref.currHealth);
      this.setState({ battlePlayer: ref })
    } else {
      const mult = Math.random() + 0.5;
      let ref = this.state.battlePlayer;
      let dmg = mult * ref.attackPower;
      console.log("player", ref);
      console.log("damage", dmg);
      console.log("outcome", ref.currHealth);
      ref.currHealth -= dmg;
      this.setState({ battlePlayer: ref })
    }
    if(this.state.battlePlayer.currHealth <= 0 || !this.state.battlePlayer.currHealth) {
      this.setState({ battleOpponent: {} });
    }
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
        {/* <input id="input" onChange={(e) => {this.setState({newVal: e.target.value})}}></input>
        <button onClick={this.updateValue}>Set Stored Value</button> */}
        <Arena computeTurn={this.computeTurn} playerHealth={this.state.battlePlayer.currHealth} opponentHealth={this.state.battleOpponent.currHealth} />
      </div>
    );
  }
}

export default App;
