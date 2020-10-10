import React from 'react';
import SignUpForm from "../../Components/SignUpForm";

import {login} from '../../Utils';

const SignUpPage = (props) => {

    const handleSignUp = () => {
        login();
        props.history.push('/dashboard');
    };

    return (
        <div>
            <SignUpForm handleSignUp={handleSignUp}/>
        </div>
    );
};

export default SignUpPage;