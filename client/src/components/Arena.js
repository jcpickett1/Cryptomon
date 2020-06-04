import React, { Component } from "react";

class Arena extends Component {
    render() {
        return <div style={{ display: 'flex' }}>
          <div style={{ background: 'gray', width: '100%' }}>
            <b>Player</b>
            <br />
            Health: {this.props.playerHealth}
            <br />
            <button onClick={() => { this.props.computeTurn(1) }}>Attack</button>
            <button onClick={() => { this.props.computeTurn(2) }}>Guard</button>
            <button onClick={() => { this.props.computeTurn(3) }}>Run</button>
          </div>

          {this.props.opponentHealth ? <div style={{ background: 'red', width: '100%' }}>
            <b>Opponent</b>
            <br />
            Health: {this.props.opponentHealth}
          </div> : ''}
        </div>
    }
}

export default Arena;