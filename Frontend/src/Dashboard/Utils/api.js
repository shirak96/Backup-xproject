import axios from 'axios';
import {TOKEN_KEY} from "./index";

const {REACT_APP_PORT} = process.env;

const API = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const headers = {};

    if (token) {
        headers.auth = token;
    }

    return axios.create({
        baseURL: `${REACT_APP_PORT}`,
        headers
    });

}
export const AuthHeader = {
    'auth': localStorage.getItem(TOKEN_KEY)
}

export default API;