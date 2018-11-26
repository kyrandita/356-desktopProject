import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    console.log(this);
    this.state = {
      trackables : {
        A: 15,
        B: 400,
      }
    }
  }

  newTrackable(e) {
    console.log(e);
    // TODO

  }

  render() {
    return (
      <div className="App">
        {/* left side nave bar */}
        <nav>
          <button onClick={this.newTrackable}>Add Trackable</button>
          <button onClick={this.receiveShipment}>Receive Inventory</button>
          <button onClick={this.removeInventory}>Checkout Inventory</button>

        </nav>
        {/* routed main OR inventory screen if we're gonna do modals for everything */}
        <div>
          {Object.keys(this.state.trackables).map(trackableKey => { return <p>{this.state.trackables[trackableKey]}</p>})}
        </div>
      </div>
    );
  }
}

export default App;
