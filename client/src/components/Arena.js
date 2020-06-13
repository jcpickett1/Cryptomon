import React, { Component } from "react";

class Arena extends Component {
    render() {
      return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', background: 'gray', width: '30%', padding: '8px' }}>
              <div>
                <b>Player</b>
                <br />
                Name: {this.props.playerName}
                <br />
                Health: {this.props.playerHealth}
                <br />
                Speed: {this.props.playerSpeed}
                <br />
                Attack: {this.props.playerAttack}
                <br />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <b>Abilities</b>
                {this.props.playerAbilities.map((e, ind) => {
                  return <button key={ind}>{e}</button>
                  })}
              </div>
            </div>

            {(this.props.opponentHealth > 0) ?
            <div style={{ background: 'red', width: '30%' }}>
              <b>Opponent</b>
              <br />
              Name: {this.props.opponentName}
              <br />
              Health: {this.props.opponentHealth}
              <br />
              Speed: {this.props.opponentSpeed}
              <br />
              Attack: {this.props.opponentAttack}
            </div> : ''}
          </div>
          <button onClick={this.props.battleAction}>Battle Action</button>
        </div>
      )
    }
}

export default Arena;