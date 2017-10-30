import React from 'react';
import './App.css'

export class ListGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameID : null,
            list: null,
            text : null,
            errorText : null,
            listAll : true
        }
        this.handleGameIdInput = this.handleGameIdInput.bind(this);
        this.getGames = this.getGames.bind(this);
        this.getGame = this.getGame.bind(this);
    }

    handleGameIdInput(event) {
        this.setState({gameID: event.target.value});
    }

    getGames(event) {
        let _this = this;

        this.setState({
            list: "placeholder",//TODO
            errorText: null
        });
        this.props.dataService.getAllGames().then(
            function (results) {
                _this.setState({list: JSON.stringify(results, null, '\t')});
            },
            function (err) {
                _this.setState({errorText: err});
            }
        )
    }

    getGame(event) {
        let _this = this;

        this.setState({
            text: "Placeholder",//TODO
            errorText: null
        });

        this.props.dataService.getSingleGame(this.state.gameID).then(
            function (results) {
                _this.setState({text: JSON.stringify(results, null, '\t')});
            },
            function (err) {
                _this.setState({errorText: err});
            }
        )
    }

    render() {
        return (
            <div>
              <div>
                <h1 >List games</h1>
                <div>
                  <label>
                    List all games:
                  </label>
                  <button type="submit" name="request_games" onClick={this.getGames}>
                    {"Get games"}
                  </button>
                  <br/><br/>
                  <span>
                    <pre>{(this.state.list) ? this.state.list : ""}</pre>
                  </span>
                </div>
              </div>
              <div>
                <h1>Find game by ID(may be by name later)</h1>
                <label>
                  Find game by ID:
                  <input type="text" name="gameID_input" className="gameID_in" value={this.state.gameID} onChange={this.handleGameIdInput}/>
                </label>
                <button type="submit" name="request_game" onClick={this.getGame}>
                  {"Find game"}
                </button>
                <br/><br/>
                <span>
                  <pre>{this.state.text ? this.state.text : ""}</pre>
                </span>
              </div>
            </div>
        );
    }
}
