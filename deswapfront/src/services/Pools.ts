import axios from "axios";

class PoolService {
    getAll = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/pools/`);
            return response.data;
        } catch (err) {
            return [];
        }
    }

    getById = async (id: number) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/pools/${id}`);
            return response.data;
        } catch (err) {
            return null;
        }
    }

    create = async (name: string, symbole: string, address: string, logo: string, price: number) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/pools/add`,
                { name, symbole, price, logo, address }
            );
            return response.data;
        } catch (err) {
            return null;
        }
    }

    update = async (id: number, name: string, symbole: string, address: string, logo: string, price: number, pools: string[]) => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/pools/update`,
                { name, symbole, price, logo, address, pools }
            );
            return response.data;
        } catch (err) {
            return null;
        }
    }
}

export default PoolService;