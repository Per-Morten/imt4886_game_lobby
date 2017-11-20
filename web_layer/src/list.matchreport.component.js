import React from 'react';
import './App.css'

export class MatchReports extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameID : null,
            list: null
        }
        this.handleGameIdInput = this.handleGameIdInput.bind(this);
        this.getMatchreports = this.getMatchreports.bind(this);
    }

    handleGameIdInput(event) {
        this.setState({gameID: event.target.value});
    }


    getMatchreports(event) {
        let _this = this;

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


    render() {
        return (
            <div>
              <div>
                <h1 >List match reports for a specified game</h1>
                <div>
                  <label>
                    {"List all match reports for GameID:"}
                    <input type="text" id="gameID_input" className="gameID_in" pattern="[0-9a-fA-F]{24}" title="GameID" value={this.state.gameID} onChange={this.handleGameIdInput}/>
                  </label>
                  <button type="submit" name="request_matches" onClick={this.getMatchreports}>
                    {"Request matches"}
                  </button>
                  <br/><br/>
                  <span>
                    {(this.state.list) ?
                        <ul className="MatchList">
                        {
                            this.state.list.map((item, key) => {
                                return(<li key={key}><b>{"mathcID: "}</b>{item.matchID} <b>{"Game Token: "}</b> {item.gameToken} <b>{"Data"}</b> {item.data}</li>)
                            })
                        }
                        </ul>
                        : ""}
                  </span>
                </div>
              </div>
            </div>
        );
    }
}
