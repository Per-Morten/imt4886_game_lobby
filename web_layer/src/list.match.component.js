import React from 'react';
import './App.css'

export class ListMatch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            matchID : null,
            gameID : null,
            list: null,
            text : null,
            errorText : null,
            listAll : true
        }
        this.handleGameIdInput = this.handleGameIdInput.bind(this);
        this.handleMatchIdInput = this.handleMatchIdInput.bind(this);
        this.getMatches = this.getMatches.bind(this);
        this.getMatch = this.getMatch.bind(this);
    }

    handleGameIdInput(event) {
        this.setState({gameID: event.target.value});
    }

    handleMatchIdInput(event) {
        this.setState({matchID: event.target.value});
    }

    getMatches(event) {
        let _this = this;

        this.setState({
            list: null,
            errorText: null
        });
        this.props.dataService.getAllMatches(this.state.gameID).then(
            function (results) {
                _this.setState({list: JSON.stringify(results, null, '\t')});
            },
            function (err) {
                _this.setState({errorText: err});
            }
        )
    }

    getMatch(event) {
        let _this = this;

        this.setState({
            text: "placeholder",//TODO
            errorText: null
        });

        this.props.dataService.getSingleMatch(this.state.matchID).then(
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
                <h1 >List matches for a specified game</h1>
                <div>
                  <label>
                    List all matches for GameID:
                    <input type="text" id="gameID_input" className="gameID_in" value={this.state.gameID} onChange={this.handleGameIdInput}/>
                  </label>
                  <button type="submit" name="request_matches" onClick={this.getMatches}>
                    {"Request matches"}
                  </button>
                  <br/><br/>
                  <span>
                    <pre>{(this.state.list) ? this.state.list : ""}</pre>
                  </span>
                </div>
              </div>
              <div>
                <h1>Find match by ID(may be by name later)</h1>
                <label>
                  Find match by ID:
                  <input type="text" name="matchID_input" className="matchID_in" value={this.state.matchID} onChange={this.handleMatchIdInput}/>
                </label>
                <button type="submit" name="request_match" onClick={this.getMatch}>
                  {"Find match"}
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
