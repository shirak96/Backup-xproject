import React, {Component} from "react";

import LoginForm from "../Components/LoginForm";

import API from '../Utils/api';
import {login} from "../Utils";

class LoginContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    handleLogin = async (user) => {
        try {
            const response = await API().post('auth/login', {
                email: user.email,
                password: user.password
            });

            login(response.data.data.token);
            this.props.handleLogin();
        } catch (e) {
            alert('fail ' + e.message)
        }
    };

    render() {
        return <LoginForm handleLogin={this.handleLogin}/>
    }
}

export default LoginContainer;
