import React from 'react';
import './App.css'

export class SignupComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors : {},
            user : {
                email : null,
                name : null,
                password : null
            }
        }
        this.handleEmailInput = this.handleEmailInput.bind(this);
        this.handlePasswordInput = this.handlePasswordInput.bind(this);
        this.handleRegistration = this.handleRegistration.bind(this);
    }

    handleEmailInput(event) {
        this.setState({email: event.target.value});
    }

    handlePasswordInput(event) {
        this.setState({password: event.target.value});
    }

    handleRegistration(event) {

    }


    render() {
        return(
            <div>
            <h1>Signup</h1>
            <form className="signup-form" action="">
              <div>
                {"Email:"}
                <input type="email" name="Email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" value={this.state.user.email}/>
              </div>
              <div>
                {"Name:"}
                <input type="text" name="name" value={this.state.user.name}/>
              </div>
              <div>
                {"Password:"}
                <input type="password" name="password" value={this.state.user.password}/>
              </div>
              <div>
                <button type="button" name="button" onClick={this.handleRegistration}>Submit registration</button>
              </div>
            </form>
            </div>
        );
    }
}
