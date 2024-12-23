/* eslint-disable */
import Axios from "./Axios";

export default {
    async auth(username, password){
        const payload = {username, password}
        const response = await Axios.post('/auth', payload);

        return response.data;
    }
};