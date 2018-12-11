import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      addTrackableName: '',
      addTrackablePerishable: false,
      addInventoryCount: 0,
      addInventoryPerishableDate: '',
      addInventoryTrackableType: 'morty',
      decrementInventoryTrackableType: 'morty',
      decrementInventoryCount: 0,
      selectedTrackable: null,
      decrementInventoryReason: 'Consumed',
      trackables : [
        {
          name: 'morty',
          perishable: true,
          yourmom: true,
          lots: [
            {
              uuid: 'a',
              count: 40,
              creation_date: '2018-10-30T16:23:16Z',
              expiration_date: '2018-11-29'
            },
            {
              uuid: 'b',
              count: 70,
              creation_date: '2018-10-30T14:23:16Z',
              expiration_date: '2018-11-30'
            }
          ],
          log: [
            {
              uuid: 'c',
              date: '2018-11-30T14:23:16Z',
              'type': 'Shrinkage',
              'details': 'Count discrepancy indicates shrinkage of -4 items'
            }
          ]
        },
        {
          name: 'bananas',
          perishable: true,
          yourmom: true,
          lots: [
            {
              uuid: 'a',
              count: 100,
              creation_date: '2018-09-15T10:24:19Z',
              expiration_date: '2018-12-25T04:00:00Z'
            },
            {
              uuid: 'b',
              count: 30,
              creation_date: '2018-08-04T08:13:09Z',
              expiration_date: '2018-09-04T09:00:00Z'
            }
          ],
          log: [
            {
              uuid: 'c',
              date: '2018-11-30T14:23:16Z',
              'type': 'Shipment',
              'details': 'A shipment was received totaling 47 items in 2 separate lots'
            }
          ]
        }
      ]
    }
    // this.newTrackable = this.newTrackable.bind(this);
  }

  componentDidMount = () => {
    this.refs.splash.showModal();
    this.refs.splash.addEventListener('click', () => {
      this.refs.splash.close();
    });

  }

  newTrackable = (e) => {
    this.refs.addTrackable.showModal();
  }

  receiveShipment = () => {
    this.refs.addInventory.showModal();
  }

  removeInventory = () => {
    this.refs.decrementInventory.showModal();
  }

  decrementInventoryCountOnChange = (e) => {
    this.setState({ decrementInventoryCount: parseInt(e.target.value) || '' })
  }

  decrementInventoryTrackableTypeOnChange = (e) => {
    this.setState({ decrementInventoryTrackableType: e.target.value });
  }

  addInventoryCountOnChanage = (e) => {
    this.setState({ addInventoryCount: parseInt(e.target.value) || '' });
  }

  addInventoryTrackableTypeOnChange = (e) => {
    this.setState({ addInventoryTrackableType: e.target.value });
  }

  addInventoryPerishableDateOnChange = (e) => {
    this.setState({ addInventoryPerishableDate: e.target.value });
  }

  addTrackableNameOnChange = (e) => {
    this.setState({addTrackableName: e.target.value});
  }

  addTrackablePerishableOnChange = (e) => {
    this.setState({addTrackablePerishable: e.target.checked});
  }

  decrementInventoryReasonOnChange = (e) => {
    this.setState({decrementInventoryReason: e.target.value});
  }

  decrementInventorySave = () => {
    let trackable = this.state.trackables.find(tr => {
      return tr.name === this.state.decrementInventoryTrackableType;
    });

    if (this.state.decrementInventoryCount < 1 || !trackable || this.state.decrementInventoryCount > trackable.lots.reduce((sum, curr) => {
      return sum + curr.count;
    }, 0
    )) {
      alert("Not a valid amount");
      this.decrementInventoryClear();
      return;
    }

    let sortedLots = [...trackable.lots.values()].sort((lot1, lot2) => {
      if (lot1.expiration_date < lot2.expiration_date) {
        return -1;
      }
      return 1;
    });
    let decrementCount = this.state.decrementInventoryCount;
    while (decrementCount > 0) {
      let currentLot = sortedLots.shift();
      if (currentLot.count > decrementCount) {
        trackable.log.push({ uuid: Math.floor(Math.random() * 100000000), date: (new Date()).toISOString(), type: this.state.decrementInventoryReason, details: `Pulled ${decrementCount} from lot of ${trackable.name}`});
        currentLot.count -= decrementCount;
        decrementCount = 0;
      } else {
        trackable.log.push({ uuid: Math.floor(Math.random() * 100000000), date: (new Date()).toISOString(), type: this.state.decrementInventoryReason, details: `Pulled ${currentLot.count} from lot of ${trackable.name} - finishing lot.`});
        decrementCount -= currentLot.count;
        // we're destroying this lot, so we don't need to set it's count to 0
        let index = trackable.lots.findIndex(lot => {
          return lot.creation_date === currentLot.creation_date;
        });
        trackable.lots.splice(index, 1);
      }
      this.setState({ decrementInventoryCount: 0 });
    }
  }

  decrementInventoryClear = () => {
    this.setState({ decrementInventoryCount: 0, decrementInventoryTrackableType: 'morty' });
  }

  addInventorySave = () => {
    let trackable = this.state.trackables.find(tr => {
      return tr.name === this.state.addInventoryTrackableType;
    });

    if (this.state.addInventoryCount < 1) {
      alert("Not a valid amount");
      this.addInventoryClear();
      return;
    }

    if (!trackable) {
      alert("That item doesn't exist");
      this.addInventoryClear();
      return;
    }

    let track = {
      count: this.state.addInventoryCount,
      creation_date: (new Date()).toISOString(),
      uuid: Math.floor(Math.random() * 100000000)
    };

    if (trackable.perishable) {
      let dateParts = this.state.addInventoryPerishableDate.split('-');
      dateParts[1] = dateParts[1] - 1;
      track.expiration_date = new Date(...dateParts).toISOString();
    }
    
    trackable.lots.push(track);
    trackable.log.push({ uuid: Math.floor(Math.random() * 100000000), date: (new Date()).toISOString(), type: 'Inventory received', details: `Received ${this.state.addInventoryCount} of ${trackable.name}`});

     this.addInventoryClear();
  }

  addInventoryClear = () => {
    this.setState({ addInventoryCount: 0,
      addInventoryPerishableDate: '',
      addInventoryTrackableType: 'morty'
    });
  }

  addTrackableSave = () => {
    if (this.state.trackables.find(tr => tr.name === this.state.addTrackableName)) {
      alert("cannot add duplicate Trackable");
      this.addTrackableClear();
      return;
    }

    if (!this.state.addTrackableName) {
      alert("Item name cannot be blank.");
      this.addTrackableClear();
      return;
    }

    this.setState({
      trackables: [...this.state.trackables, {
        name: this.state.addTrackableName,
        perishable: this.state.addTrackablePerishable,
        lots: [],
        log: [{ uuid: Math.floor(Math.random() * 100000000), date: (new Date()).toISOString(), type: 'Creation', details: `Started tracking ${this.state.addTrackableName} on ${(new Date()).toISOString()}`}]
      }],
      addTrackableName: '',
      addTrackablePerishable: false,
    })
  }

  addTrackableClear = () => {
    this.setState({
      addTrackableName: '',
      addTrackablePerishable: false,
    })
  }

  trackableDetails = e => {
    let trackable = (this.state.trackables.find(t => t.name === e.target.parentElement.parentElement.dataset.name));

    this.setState({
      selectedTrackable: trackable
    });

    this.refs.showTrackableDetails.showModal();
  }

  render() {
    return (
      <div className="App">
        {/* left side nave bar */}
        <nav>
          <h1>BIMSĒ</h1>
          <button className="primary good" onClick={this.newTrackable}>New Item</button>
          <button className="primary good" onClick={this.receiveShipment}>Add Inventory</button>
          <button className="primary good" onClick={this.removeInventory}>Remove Inventory</button>
        </nav>
        {/* routed main OR inventory screen if we're gonna do modals for everything */}
        <div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Total Inventory</th>
                <th>Earliest Lot Expiration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.trackables.map(trackable => {
                return <tr key={trackable.name} data-name={trackable.name}>
                  <td>{trackable.name}</td>
                  <td>{trackable.lots.reduce((sum, curr) => {
                    return sum + curr.count
                  }, 0
                  )}</td>
                  <td>{trackable.perishable ? ( trackable.lots.length > 0 ? new Date(trackable.lots.reduce((earliestExp, curr) => {
                    let newestExp = (new Date (curr.expiration_date)).valueOf();
                    if (earliestExp > newestExp || !earliestExp) {
                      return newestExp;
                    }
                    return earliestExp;
                  }, null
                )).toDateString() : 'No lots' ) : 'N/A'}</td>
                <td><button className="secondary good" onClick={this.trackableDetails}>Details</button></td></tr>
              })}
            </tbody>
          </table>
        </div>

        {/* Splash Page */}
        <dialog id="splash" ref="splash">
          <h1>The Best Inventory Management System EVAR (BIMSE)</h1>
          <h2>Minimalist Inventory Management</h2>
        </dialog>

        {/* Add new trackable form dialog */}
        <dialog id="addTrackable" ref="addTrackable">
          <form method="dialog">
            <h2>Track New Item</h2>
            <label>Item:</label>
            <input type="text" placeholder="name" value={this.state.addTrackableName} onChange={this.addTrackableNameOnChange} />
            <label>Perishable: <input type="checkbox" checked={this.state.addTrackablePerishable} onChange={this.addTrackablePerishableOnChange} /></label>
            <menu>
              <button className="primary good" onClick={this.addTrackableSave}>Confirm</button>
              <button className="primary bad" onClick={this.addTrackableClear}>Cancel</button>
            </menu>
          </form>
        </dialog>

        {/* Add inventory form dialog */}
        <dialog id="addInventory" ref="addInventory">
          <form method="dialog">
            <h2>Add Inventory</h2>
            <label>Item:</label>
            <select id="trackableId" value={this.state.addInventoryTrackableType} onChange={this.addInventoryTrackableTypeOnChange}>
              {this.state.trackables.map(trackable => {
                return <option key={trackable.name} value={trackable.name}>{trackable.name}</option>
              })}
            </select>
            <label>Amount:</label>
            <input type="number" placeholder="count" value={this.state.addInventoryCount} onChange={this.addInventoryCountOnChanage} />
            { this.state.trackables.find(a => a.name === this.state.addInventoryTrackableType).perishable ? <React.Fragment><label>Expiration Date:</label> <input type="date" value={this.state.addInventoryPerishableDate} onChange={this.addInventoryPerishableDateOnChange} /></React.Fragment> : '' }
            <menu>
              <button className="primary good" onClick={this.addInventorySave}>Confirm</button>
              <button className="primary bad" onClick={this.addInventoryClear}>Cancel</button>
            </menu>
          </form>
        </dialog>

        {/* Decrement inventory form dialog */}
        <dialog id="decrementInventory" ref="decrementInventory">
          <form method="dialog">
            <h2>Decrement Inventory</h2>
            <label>Item:</label>
            <select id="trackableId" value={this.state.decrementInventoryTrackableType} onChange={this.decrementInventoryTrackableTypeOnChange}>
              {this.state.trackables.map(trackable => {
                return <option key={trackable.name} value={trackable.name} key={trackable.name}>{trackable.name}</option>
              })}
            </select>
            <label>Quantity:</label>
            <input type="number" placeholder="count" value={this.state.decrementInventoryCount} onChange={this.decrementInventoryCountOnChange} />
            <label>Reason:</label>
            <select value={this.state.decrementInventoryReason} onChange={this.decrementInventoryReasonOnChange}>
              <option value='Consumed'>Consumed</option>
              <option value='Shrinkage'>Shrinkage</option>
            </select>
            <menu>
              <button className="primary good" onClick={this.decrementInventorySave}>Confirm</button>
              <button className="primary bad" onClick={this.decrementInventoryClear}>Cancel</button>
            </menu>
          </form>
        </dialog>

        {/* Show trackable details */}
        <dialog id="showTrackableDetails" ref="showTrackableDetails">
          <h2>Trackable Details</h2>
          <button onClick={() => document.getElementById('showTrackableDetails').close()}>X</button>
          {(this.state.selectedTrackable) ? <div>
          <div className="details">
            <p><label>Item:</label> {this.state.selectedTrackable.name}</p>
            { this.state.selectedTrackable.perishable ? <p>Perishable</p> : '' }
          </div>
          <table className="lots">
            <thead>
              <tr>
                <th colSpan="3">Lots</th>
              </tr>
              <tr>
                <th>Count</th>
                <th>Creation Date</th>
                <th>Expiration Date</th>
              </tr>
            </thead>
            <tbody>
              {this.state.selectedTrackable.lots.map(lot => {
                return <tr key={lot.uuid}>
                  <td>{lot.count}</td>
                  <td>{lot.creation_date}</td>
                  <td>{lot.expiration_date || 'N/A'}</td></tr>
              })}
            </tbody>
          </table>
          <table className="log">
            <thead>
            <tr>
                <th colSpan="3">Log</th>
              </tr>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {this.state.selectedTrackable.log.map(entry => {
                return <tr key={entry.uuid}>
                  <td>{entry.date}</td>
                  <td>{entry.type}</td>
                  <td>{entry.details}</td>
                </tr>
              })}
            </tbody>
          </table></div> : '' }
        </dialog>
      </div>
    );
  }
}

export default App;
