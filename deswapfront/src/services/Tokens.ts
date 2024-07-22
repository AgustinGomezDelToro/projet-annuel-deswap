import axios from "axios";

class Token {
    getAll = async () => {
        const response = await axios.get(`http://localhost:3001/tokens`);
        return response.data;
    }

    getByAddress = async (address: string) => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/tokens/${address}`);
        return response.data;
    }

    create = async (name: string, symbole: string, address: string, logo: string, price: number) => {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/tokens/add`, 
            { name, symbole, price, logo, address }
        );
        return response.data;
    }

    update = async (id: number, name: string, symbole: string, address: string, logo: string, price: number, pools: string) => {
        const response = await axios.put(
            `${process.env.REACT_APP_API_URL}/tokens/update`, 
            { name, symbole, price, logo, address, pools }
        );
        return response.data;
    }
}

export default Token;