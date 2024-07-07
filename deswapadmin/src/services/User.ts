import axios from "axios";
import { IUser } from "../interfaces/Users";

class User {
    getAll = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/`);
        return response.data;
    }
    
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

    update = async (user: IUser) => { // TODO : verifier si c'est put + ajouter bearer token
        const response = await axios.put(
            `${process.env.REACT_APP_API_URL}/users/update`,
            user 
        )
        return response.data;
    }
}

export default User;