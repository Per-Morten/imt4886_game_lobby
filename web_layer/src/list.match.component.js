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

    //Get all matches for specified game
    getMatches(event) {
        let _this = this;
        //let tempList;

        this.setState({
            list: "",
            errorText: null
        });
        this.props.dataService.getAllMatches(this.state.gameID).then(
            function (results) {
                if (results[0].hasOwnProperty('gameToken')) {
                    _this.setState({list: results});
                } else {
                    _this.setState({list: JSON.parse({"name":"Bad Game id"})})
                }
            },
            function (err) {
                _this.setState({errorText: err});
            }
        )
    }

    //Get match by name
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
                    {"Get all matches"}
                    <input type="checkbox" name="getAll" value="All"/><br/>
                    {"List all matches for GameID:"}
                    <input type="text" id="gameID_input" className="gameID_in" pattern="[0-9a-fA-F]{24}" title="GameID" value={this.state.gameID} onChange={this.handleGameIdInput}/>
                  </label>
                  <button type="submit" name="request_matches" onClick={this.getMatches}>
                    {"Request matches"}
                  </button>
                  <br/><br/>
                  <span>
                    {(this.state.list) ?
                        <ul className="MatchList">
                        {
                            this.state.list.map((item, key) => {
                                return(<li key={key}>{item.name}</li>)
                            })
                        }
                        </ul>
                        : ""}
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
