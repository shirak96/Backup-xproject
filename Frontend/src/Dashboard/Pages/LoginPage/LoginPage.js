import React from 'react';
import LoginContainer from "../../Containers/LoginContainer";
import {useBodyClass} from "../../Utils/hooks";
import './LoginPage.scss'
const LoginPage = (props) => {
    useBodyClass([ 'login-page']);

    const handleLogin = () => {
        props.logUserIn();
        props.history.push('/dashboard');
    }

    return (
        <div>
            <LoginContainer handleLogin={handleLogin}/>
        </div>
    );
};

export default LoginPage;
