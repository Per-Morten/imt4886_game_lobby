import React from 'react';
import './App.css'

export class EditGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameId: null,
            update: {
                name: null,
                description: null
            },
            updateResponse: null,
            errorText: null
        }
        this.handleGameIdInput = this.handleGameIdInput.bind(this);
        this.handleGameNameInput = this.handleGameNameInput.bind(this);
        this.handleDescriptionInpup = this.handleDescriptionInpup.bind(this);
        this.deleteGame = this.deleteGame.bind(this);
        this.updateGame = this.updateGame.bind(this);
    }

    handleGameIdInput(event) {
        this.setState({gameId: event.target.value});
    }

    handleGameNameInput(event) {
        this.setState({name: event.target.value});
    }

    handleDescriptionInpup(event) {
        this.setState({description: event.target.value});
    }

    deleteGame(event) {
        let _this = this;

        this.props.dataService.deleteGame(this.state.gameId).then(
            function (results) {
                _this.setState({updateResponse: JSON.stringify(results, null, '\t')});
            },
            function (err) {
                _this.setState({errorText: err});
            }
        )
    }

    updateGame(event) {
        let _this = this;

        this.props.dataService.updateGame(this.state.gameId, this.state.update).then(
            function (results) {
                _this.setState({updateResponse: JSON.stringify(results, null, '\t')});
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
                <h1>Update Game</h1>
                <label>
                  Game ID:
                  <input type="text" name="game_id" pattern="[0-9a-fA-F]{24}" title="GameID" value={this.state.gameId} onChange={this.handleGameIdInput}/>
                </label>
                <br/>
                <br/>
                <br/>
                <br/>
                <label>
                  Name:
                  <input type="text" name="game_name" value={this.state.update.name} onChange={this.handleGameNameInput}/>
                </label>
                <label>
                  Description:
                  <input type="text" name="game_description" value={this.state.update.description} onChange={this.handleDescriptionInput}/>
                </label>
                <br/>
                <button type="submit" name="game_update_submit" onClick={this.updateGame}>Update Game</button>
              </div>
                <div>
                <h1 >Delete Game</h1>
                    <form class="delete_game" action="">
                        <br/>
                        <button type="submit" name="game_delete_submit" onClick={this.deleteGame}>Delete Game</button>
                    </form>
                </div>
                <div>
                  <span>
                  {(this.state.updateResponse) ? this.state.updateResponse : ""}
                  </span>
                </div>
            </div>
        );
    }
}
