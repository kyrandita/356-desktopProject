import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    console.log(this);
    this.state = {
      addTrackableName: '',
      addTrackablePerishable: false,
      addInventoryCount: 0,
      addInventoryPerishableDate: '',
      addInventoryTrackableType: 'morty',
      decrementInventoryTrackableType: 'morty',
      decrementInventoryCount: 0,
      selectedTrackable: null,
      trackables : [
        {
          name: 'morty',
          perishable: true,
          yourmom: true,
          lots: [
            {
              count: 40,
              creation_date: '2018-10-30T16:23:16Z',
              expiration_date: '2018-11-29'
            },
            {
              count: 70,
              creation_date: '2018-10-30T14:23:16Z',
              expiration_date: '2018-11-30'
            }
          ],
          log: [
            {
              date: '2018-11-30T14:23:16Z',
              'type': 'shrinkage',
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
              count: 100,
              creation_date: '2018-09-15T10:24:19Z',
              expiration_date: '2018-12-25T04:00:00Z'
            },
            {
              count: 30,
              creation_date: '2018-08-04T08:13:09Z',
              expiration_date: '2018-09-04T09:00:00Z'
            }
          ],
          log: [
            {
              date: '2018-11-30T14:23:16Z',
              'type': 'shipment',
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
    })
  }

  newTrackable = (e) => {
    console.log(e);
    // TODO
    // this.setState({ trackables: { ...this.state.trackables, C: 2000000000000000000 } });
    this.refs.addTrackable.showModal();
  }

  receiveShipment = () => {
    this.refs.addInventory.showModal();
  }

  removeInventory = () => {
    this.refs.decrementInventory.showModal();
  }

  decrementInventoryCountOnChange = (e) => {
    this.setState({ decrementInventoryCount: parseInt(e.target.value) })
  }

  decrementInventoryTrackableTypeOnChange = (e) => {
    this.setState({ decrementInventoryTrackableType: e.target.value });
  }

  addInventoryCountOnChanage = (e) => {
    this.setState({ addInventoryCount: parseInt(e.target.value) });
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

  decrementInventorySave = () => {
    console.log('neals mom');
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
      console.log(trackable.lots.values(), trackable.lots);
      if (lot1.expiration_date < lot2.expiration_date) {
        return -1;
      }
      return 1;
    });
    console.log(sortedLots);
    let decrementCount = this.state.decrementInventoryCount;
    while (decrementCount > 0) {
      console.log('before', sortedLots);
      let currentLot = sortedLots.shift();
      console.log('after', sortedLots);
      console.log(currentLot);
      if (currentLot.count > decrementCount) {
        currentLot.count -= decrementCount;
        decrementCount = 0;
      } else {
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

    if (this.state.addInventoryCount < 1 || !trackable) {
      alert("Not a valid amount");
      this.addInventoryClear();
      return;
    }

    trackable.lots.push({
      count: this.state.addInventoryCount,
      creation_date: (new Date()).toISOString(),
      expiration_date: this.state.addInventoryPerishableDate
     });

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
    console.log(this.state.addTrackablePerishable, this.state.addTrackableName);
    this.setState({
      trackables: [...this.state.trackables, {
        name: this.state.addTrackableName,
        perishable: this.state.addTrackablePerishable,
        lots: [],
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
    let trackable = (this.state.trackables.find(t => t.name === e.target.parentElement.dataset.name));

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
                return <tr key={trackable.name} data-name={trackable.name} onClick={this.trackableDetails}>
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
                )).toDateString()}</td></tr>
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
            <p><label>Add New Trackable</label></p>
            <input type="text" placeholder="name" value={this.state.addTrackableName} onChange={this.addTrackableNameOnChange} />
            <input type="checkbox" checked={this.state.addTrackablePerishable} onChange={this.addTrackablePerishableOnChange} />
            <button onClick={this.addTrackableSave}>Confirm</button>
            <button onClick={this.addTrackableClear}>Cancel</button>
          </form>
        </dialog>

        {/* Add inventory form dialog */}
        <dialog id="addInventory" ref="addInventory">
          <form method="dialog">
            <p><label>Add Inventory</label></p>
            <select id="trackableId" value={this.state.addInventoryTrackableType} onChange={this.addInventoryTrackableTypeOnChange}>
              {this.state.trackables.map(trackable => {
                return <option value={trackable.name}>{trackable.name}</option>
              })}
            </select>
            <input type="number" placeholder="count" value={this.state.addInventoryCount} onChange={this.addInventoryCountOnChanage} />
            <input type="date" value={this.state.addInventoryPerishableDate} onChange={this.addInventoryPerishableDateOnChange} />
            <button onClick={this.addInventorySave}>Confirm</button>
            <button onClick={this.addInventoryClear}>Cancel</button>
          </form>
        </dialog>

        {/* Decrement inventory form dialog */}
        <dialog id="decrementInventory" ref="decrementInventory">
          <form method="dialog">
            <p><label>Decrement Inventory</label></p>
            <select id="trackableId" value={this.state.decrementInventoryTrackableType} onChange={this.decrementInventoryTrackableTypeOnChange}>
              {this.state.trackables.map(trackable => {
                return <option value={trackable.name} key={trackable.name}>{trackable.name}</option>
              })}
            </select>
            <input type="number" placeholder="count" value={this.state.decrementInventoryCount} onChange={this.decrementInventoryCountOnChange} />
            <button onClick={this.decrementInventorySave}>Confirm</button>
            <button onClick={this.decrementInventoryClear}>Cancel</button>
          </form>
        </dialog>

        {/* Show trackable details */}
        <dialog id="showTrackableDetails" ref="showTrackableDetails">
          {(this.state.selectedTrackable) ? <div><p><label>Trackable Details</label></p>
          <div>
            <p>{this.state.selectedTrackable.name}</p>
            <p>{this.state.selectedTrackable.perishable}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Count</th>
                <th>Creation Date</th>
                <th>Expiration Date</th>
              </tr>
            </thead>
            <tbody>
              {this.state.selectedTrackable.lots.map(lot => {
                return <tr>
                  <td>{lot.count}</td>
                  <td>{lot.creation_date}</td>
                  <td>{lot.expiration_date}</td>
                </tr> 
              })}
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {this.state.selectedTrackable.log.map(entry => {
                return <tr>
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
