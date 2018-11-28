import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    console.log(this);
    this.state = {
      trackables : [
        {
          name: 'morty',
          perishable: true,
          yourmom: true,
          lots: [
            {
              count: 40,
              creation_date: '2018-10-30T16:23:16Z',
              expiration_date: '2018-11-29T06:00:00Z'
            },
            {
              count: 70,
              creation_date: '2018-10-30T14:23:16Z',
              expiration_date: '2018-11-30T07:00:00Z'
            }
          ]
        },
        {
          name: 'bananas',
          perishable: true,
          yourmom: true,
          lots: [
            {
              count: 100,
              creation_date: '2018-09-15T10:24:19Z',
              expiration_date: '2018-12-25T04:00:00Z'
            },
            {
              count: 30,
              creation_date: '2018-08-04T08:13:09Z',
              expiration_date: '2018-09-04T09:00:00Z'
            }
          ]
        }
      ]
    }
    // this.newTrackable = this.newTrackable.bind(this);
  }

  newTrackable = (e) => {
    console.log(e);
    // TODO
    this.setState({ trackables: { ...this.state.trackables, C: 2000000000000000000 } });
    this.refs.addTrackable.showModal();
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
          <table>
            <thead>
              <tr>
                <th>Trackable</th>
                <th>Total Inventory</th>
                <th>Earliest Lot Expiration</th>
              </tr>
            </thead>
            <tbody>
              {this.state.trackables.map(trackable => { 
                return <tr>
                  <td>{trackable.name}</td>
                  <td>{trackable.lots.reduce((sum, curr) => {
                    return sum + curr.count
                  }, 0
                  )}</td>
                  <td>{new Date(trackable.lots.reduce((earliestExp, curr) => {
                    let newestExp = (new Date (curr.expiration_date)).valueOf();
                    if (earliestExp > newestExp || !earliestExp) {
                      return newestExp;
                    }
                    return earliestExp;
                  }, null
                  )).toDateString()}</td>
                </tr>
              })}
            </tbody>
          </table>
        </div>

        <dialog id="addTrackable" ref="addTrackable">
          <form method="dialog">
            <p><label>LABEL BABY</label></p>
            <button>Confirm</button>
            <button>Cancel</button>
          </form>
        </dialog>
      </div>
    );
  }
}

export default App;
