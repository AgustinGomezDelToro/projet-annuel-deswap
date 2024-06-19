import axios from "axios";

class Token {
    getAll = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/tokens/`);
        return response.data;
    }

    create = async (name: string, symbole: string, address: string, logo: string, price: number) => {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/tokens/add`, 
            { name, symbole, price, logo, address }
        );
        return response.data;
    }
}

export default Token;