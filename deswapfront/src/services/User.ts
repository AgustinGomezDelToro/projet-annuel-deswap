import axios from "axios";

class User {
    getOneByPublicKey = async (publicKey: string) => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/getByPK/${publicKey}`);
        return response.data;
    }

    create = async (publicKey: string, signature: string) => {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/users/add`, 
            { publicKey, signature }
        );
        return response.data;
    }
}

export default User;