export const BACKEND_PORT = process.env.REACT_APP_PORT;


export async function CallAPI(api, options={}) {
    try {
        const url = BACKEND_PORT + api;
        const response = await fetch(url, options);
        return await response.json();
    } catch (err) {
        throw new Error(err);
    }
}
