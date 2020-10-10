import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import Dashboard from "./Dashboard/Dashboard";

import App from "./App";
import {Router, Switch, Route, withRouter} from "react-router-dom";
import * as serviceWorker from "./serviceWorker";

import "./index.css";
// import i18n (needs to be bundled ;))
import './i18n';
const history = createBrowserHistory();
const AppWithRouter = withRouter(props => <App {...props}/>);

ReactDOM.render(
    <Router history={history} >
        <Switch>
            <Route path={'/dashboard'} component={Dashboard}/>
            <Route path={'/'} component={AppWithRouter}/>
        </Switch>
    </Router>,
    document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
