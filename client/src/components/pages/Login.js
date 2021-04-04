import React, { Component } from "react"
import {Link, Redirect } from 'react-router-dom'

class Login extends Component {


    state = {email: "", password:""};

    onSubmit = (e) => {
        e.preventDefault();
        this.props.login.bind(this,this.state);
        this.props.login(this.state);
    }

    onChangeEmail = e => {
        this.setState({email: e.target.value});
    }

    onChangePassword = e => {
        this.setState({password: e.target.value});
    }

    render() {
        if(this.props.isAuth){
            return <Redirect to={"/"}/>
        }
        return (
            <React.Fragment>
                <h1 className="large text-secondary">Sign In</h1>
                <p className="lead">
                     Sign Into Your Account
                </p>
                <form className="form" onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            value={this.state.email}
                            onChange={this.onChangeEmail}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={this.state.password}
                            onChange={this.onChangePassword}
                            minLength="6"
                        />
                    </div>
                    <input type="submit" className="btn btn-secondary" value="Login" />
                </form>
            </React.Fragment>
        )
    }
}

export default Login;