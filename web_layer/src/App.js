import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {ListMatch} from './list.match.component'
import {ListGame} from './list.game.component'
import {DataService} from './data.service'
import {AddGame} from './add.game.component'
import {LoginComponent} from './login.component'
import {SignupComponent} from './signup.component'

class KjappContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CurrentPage : "MatchList"
        }

        this.dataService = new DataService("http://up.imt.hig.no:8333");
    }

    handleNavButton(NavDest: String) {
        this.setState({CurrentPage: NavDest})
    }

    render() {
        return (
          <div>
            <div className="App">
              <header className="App-header">
                <h1 className="App-title">Kjapp Game Lobby</h1>
                <button type="button" className="Nav-Button" onClick={() => {
                    this.handleNavButton("MatchList")
                }}>{"Match List"}</button>

                <button type="button" className="Nav-Button" onClick={() => {
                    this.handleNavButton("GameList")
                }}>{"Game List"}</button>

                <button type="button" className="Nav-Button" onClick={() => {
                    this.handleNavButton("AddGame")
                }}>{"Add Game"}</button>
                <button type="button" className="Nav-Button" onClick={() => {
                    this.handleNavButton("SignIn")
                }}>{"Login"}</button>
                <button type="button" className="Nav-Button" onClick={() => {
                    this.handleNavButton("Signup")
                }}>{"Register"}</button>
              </header>
              {this.state.CurrentPage === "MatchList" &&
              <ListMatch dataService={this.dataService}/>
              }
              {this.state.CurrentPage === "GameList" &&
              <ListGame dataService={this.dataService}/>
              }
              {this.state.CurrentPage === "AddGame" &&
              <AddGame dataService={this.dataService}/>
              }
              {this.state.CurrentPage === "SignIn" &&
              <LoginComponent dataService={this.dataService}/>
              }
              {this.state.CurrentPage === "Signup" &&
              <SignupComponent dataService={this.dataService}/>
              }
            </div>
            <div className="Footer">
              <footer>{"Developed by kjapp"}</footer>
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
