import React from 'react';
import './App.css'

export class ListGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            GameName : null,
            list: null,
            text : null,
            errorText : null,
            listAll : true
        }
        this.handleGameNameInput = this.handleGameNameInput.bind(this);
        this.getGames = this.getGames.bind(this);
        this.getGame = this.getGame.bind(this);
    }

    handleGameNameInput(event) {
        this.setState({GameName: event.target.value});
    }

    getGames(event) {
        let _this = this;

        this.setState({
            list: "",
            errorText: null
        });
        this.props.dataService.getAllGames().then(
            function (results) {
                if (results[0].hasOwnProperty('name')) {
                    _this.setState({list: results, text: null});
                } else {
                    _this.setState({list: JSON.parse({"name":"Bad request"})})
                }
            },
            function (err) {
                _this.setState({errorText: err});
            }
        )
    }

    getGame(event) {
        let _this = this;

        this.setState({
            text: "",
            errorText: null
        });

        this.props.dataService.getSingleGame(this.state.GameName).then(
            function (results) {
                if (results[0].hasOwnProperty('name')) {
                    _this.setState({text: results, list: null});
                } else {
                    _this.setState({text: JSON.parse({"name":"Bad request"})})
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
                  {(this.state.list) ?
                      <ul className="GameList">
                      {
                          this.state.list.map((item, key) => {
                              return(<li key={key}>{/*<b>{"ID: "}</b>{item._id}*/} <b>{"Name: "}</b>{item.name} <b>{"Description: "}</b> {decodeURI(item.description)}</li>)
                          })
                      }
                      </ul>
                      : ""}
                  </span>
                </div>
              </div>
              <div>
                <h1>Find game by Name</h1>
                <label>
                  Game name:
                  <input type="text" name="GameName_input" className="GameName_in" value={this.state.GameName} onChange={this.handleGameNameInput}/>
                </label>
                <button type="submit" name="request_game" onClick={this.getGame}>
                  {"Find game"}
                </button>
                <br/><br/>
                <span>
                {(this.state.text) ?
                    <ul className="GameList">
                    {
                        this.state.text.map((item, key) => {
                            return(<li key={key}><b>{"ID: "}</b>{item._id} <b>{"Name: "}</b>{item.name} <b>{"Description: "}</b> {decodeURI(item.description)}</li>)
                        })
                    }
                    </ul>
                    : ""}
                </span>
              </div>
            </div>
        );
    }
}
