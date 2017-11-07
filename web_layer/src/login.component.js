import React from 'react';
import './App.css'

export class LoginComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error : null,
            user : {
                email : null,
                password : null
            }
        }
        this.handleEmailInput = this.handleEmailInput.bind(this);
        this.handlePasswordInput = this.handlePasswordInput.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleEmailInput(event) {
        this.setState({email: event.target.value});
        console.log(event.target.value);
    }

    handlePasswordInput(event) {
        this.setState({password: event.target.value});
        console.log(event.target.value);
    }

    handleLogin(event) {

    }


    render() {
        return(
            <div>
            <h1>There will be login</h1>
            <form className="login-form" action="">
              <h2>Sign In</h2>
              <div>
                {"Email:"}
                <input type="email" name="Email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" value={this.state.user.email} onChange={this.handleEmailInput}/>
              </div>
              <div>
                {"Password:"}
                <input type="password" name="password" value={this.state.user.password} onChange={this.handlePasswordInput}/>
              </div>
              <div>
                <button type="button" name="button" onClick={this.getMatches}>Login</button>
              </div>
            </form>
            </div>
        );
    }
}
