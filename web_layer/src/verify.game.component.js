import React from 'react';
import './App.css'

export class VerifyGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameId: null,
            updateResponse: null,
            errorText: null
        }
        this.handleGameIdInput = this.handleGameIdInput.bind(this);
        this.verifyGame = this.verifyGame.bind(this);
    }

    handleGameIdInput(event) {
        this.setState({gameId: event.target.value});
        console.log(this.state.gameId);
    }

    verifyGame(event) {
        let _this = this;

        this.props.dataService.approveGame(this.state.gameId).then(
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
            <h1 >Verify Game</h1>
                <div>
                    <form class="validate_game" action="">
                        <label>
                            Game Id
                            <br/>
                            <input type="text" name="game_id" pattern="[0-9a-fA-F]{24}" title="GameID" value={this.state.gameId} onChange={this.handleGameIdInput}/>
                        </label>
                        <br/>
                        <button type="submit" name="game_validation_submit" onClick={this.verifyGame}>Verify Game</button>
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
