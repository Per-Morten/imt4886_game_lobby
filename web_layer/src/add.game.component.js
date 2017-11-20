import React from 'react';
import './App.css'

export class AddGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameName: null,
            description: null,
            aprovalText: null,
            errorText: null,
            game: null
        }
        this.handleGameNameInput = this.handleGameNameInput.bind(this);
        this.handleDescriptionInput = this.handleDescriptionInput.bind(this);
        this.addGame = this.addGame.bind(this);
    }

    handleGameNameInput(event) {
        this.setState({gameName: event.target.value});
    }

    handleDescriptionInput(event) {
        this.setState({description: event.target.value});
    }

    addGame(event) {
        let _this = this;

        this.props.dataService.addGame(this.state.gameName, this.state.description).then(
            function (results) {
                _this.setState({game: JSON.stringify(results, null, '\t')});
            },
            function (err) {
                _this.setState({errorText: err});
            }
        )
    }



    render() {
        return (
            <div>
            <h1 >Add Game</h1>
                <div>
                    <form class="register_game" action="">
                        <label>
                            Game name
                            <br/>
                            <input type="text" name="game_name" value={this.state.gameName} onChange={this.handleGameNameInput}/>
                        </label>
                        <br/>
                        <label>
                            Game description
                            <br/>
                            <input type="text" name="game_description" value={this.state.description} onChange={this.handleDescriptionInput}/>
                        </label>
                        <br/>
                        <button type="submit" name="game_name_submit" onClick={this.addGame}>Submit Game</button>
                    </form>
                </div>
                <div>
                  <span>
                  {(this.state.game) ?
                      <ul className="GameList">
                      {
                          this.state.game.map((item, key) => {
                              return(<li key={key}><b>{"Name: "}</b>{item.name} <b>{"Description: "}</b> {decodeURI(item.description)}</li>)
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
