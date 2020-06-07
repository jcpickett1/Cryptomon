import React, { Component } from "react";
import CryptomonContract from "./contracts/Nyfti.json";
import Seraph from "./contracts/Seraph.json";
import getWeb3 from "./getWeb3";
import Arena from './components/Arena';
import openSocket from 'socket.io-client';
import 'axios';

import "./App.css";
import Axios from "axios";

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
      const seraphNet = Seraph.networks[networkId];
      const instance = new web3.eth.Contract(
        CryptomonContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const seraph = new web3.eth.Contract(
        Seraph.abi,
        seraphNet && seraphNet.address,
      );
      this.battleAction = this.battleAction.bind(this);

      const socket = openSocket('http://172.21.249.78:5000');
      this.socket = socket;
      window.mintSeraph = this.mintSeraph;
      socket.on('action1', (e) => { console.log('io emitted: ', e) });
      socket.on('battleFound', async (e) => { console.log('battleFound', e); this.setState({ battleId: e }); socket.on('updateBattle' + this.state.battleId, this.updateBattle); this.updateBattle(); });

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState(
        { web3,
          accounts,
          contract: instance,
          seraph: seraph,
          battlePlayer: { abilities:[] },
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

  findBattle = async () => {
    Axios.post('http://172.21.249.78:5000/initiate', { stats: this.state.battlePlayer, account: this.state.accounts[0] })
      .then((resp) => {
        this.setState({ position: resp.data.position });
      })
  }

  updateBattle = async () => {
    Axios.get('http://172.21.249.78:5000/updateBattle', {
      params: {
        arena: this.state.battleId
      }
    }).then((resp => {
      if(resp.data[1]) this.socket.off('battleFound');
      let _ind = this.state.position === 1 ? 0 : 1;
      this.setState({ battleOpponent: resp.data[_ind], battlePlayer: resp.data[this.state.position] });
    }))
  }

  battleAction = async () => {
    Axios.post('http://172.21.249.78:5000/battleAction', {
      arena: this.state.battleId,
      position: this.state.position
    })
  }

  mintNyfti = async () => {
    let { contract, accounts } = this.state;
    await contract.methods._mint('Nyfti').send({ from: accounts[0] });
    var response;
    response = await contract.methods.getStatBlock(0).call();
    let newPlayer = {
      name: response.name,
      index: response.index,
      health: response.health,
      currHealth: response.currHealth,
      speed: response.speed,
      attackPower: response.attackPower,
      abilities: response.abilities
    }
    this.setState({ battlePlayer: newPlayer });
  }

  mintSeraph = async (_name) => {
    let { seraph, accounts } = this.state;
    await seraph.methods._mint(_name).send({ from: accounts[0] });
    var response;
    response = await seraph.methods.getStatBlock(1).call();
    let newPlayer = {
      name: response.name,
      index: response.index,
      health: response.health,
      currHealth: response.currHealth,
      speed: response.speed,
      attackPower: response.attackPower,
      abilities: response.abilities
    }
    this.setState({ battlePlayer: newPlayer });
  }

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
      abilities: response.abilities
    }
    response = await contract.methods.getStatBlock(1).call();

    this.setState({ storageValue: response, battlePlayer: resp1 });
  };

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
        <button onClick={this.mintNyfti}>Mint Nyfti</button>
        <button onClick={this.findBattle}>Find Battle</button>
        <button onClick={this.updateBattle}>Update Battle</button>
        <Arena
          battleAction={this.battleAction}
          playerName={this.state.battlePlayer.name}
          opponentName={this.state.battleOpponent.name}
          playerAbilities={this.state.battlePlayer.abilities}
          playerHealth={this.state.battlePlayer.currHealth}
          playerAttack={this.state.battlePlayer.attackPower}
          playerSpeed={this.state.battlePlayer.speed}
          opponentHealth={this.state.battleOpponent.currHealth}
          opponentAttack={this.state.battleOpponent.attackPower}
          opponentSpeed={this.state.battlePlayer.speed} />
      </div>
    );
  }
}

export default App;