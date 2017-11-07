import React from 'react';
import './App.css'

export class AddGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            GameName: null,
            aprovalText: null,
            errorText: null
        }
        this.handleGameNameInput = this.handleGameNameInput.bind(this);
        this.addGame = this.addGame.bind(this);
    }

    handleGameNameInput(event) {
        this.setState({GameName: event.target.value});
    }

    addGame(event) {
        let _this = this;

        this.props.dataService.addGame(this.state.GameName).then(
            function (results) {
                _this.setState({list: JSON.stringify(results, null, '\t')});
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
                            <input type="text" name="game_name" value={this.state.GameName} onChange={this.handleGameNameInput}/>
                        </label>
                        <br/>
                        <button type="submit" name="game_name_submit" onClick={this.addGame}>Submit Game</button>
                    </form>
                </div>
            </div>
        );
    }
}
