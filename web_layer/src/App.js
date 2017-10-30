import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {ListMatch} from './list.match.component'
import {ListGame} from './list.game.component'
import {DataService} from './data.service'
import {AddGame} from './add.game.component'

class KjappContainer extends Component {
    constructor(props) {
        super(props);

        this.dataService = new DataService("http://up.imt.hig.no:8333");
    }

    render() {
        return (
          <div>
            <div className="App">
              <header className="App-header">
                <h1 className="App-title">Kjapp Game Lobby</h1>
              </header>
              <ListMatch dataService={this.dataService}/>
              <ListGame dataService={this.dataService}/>
              <AddGame dataService={this.dataService}/>
            </div>
            <div class="Footer">
              <footer>Developed by kjapp </footer>
            </div>
          </div>
        );
    }
}

class App extends Component {
  render() {
    return (
        <KjappContainer />

    );
  }
}

export default App;
