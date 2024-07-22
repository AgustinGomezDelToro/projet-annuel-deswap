import axios from "axios";
import { PoolInterface } from "../interfaces/Pools";
import { TokenInterface } from '../interfaces/Tokens';
import { CreatePoolInterface } from "../components/Pools/Create/NewPool";

const API_URL = 'http://localhost:3001/pools';
const TOKEN_API_URL = 'http://localhost:3001/tokens';

class PoolService {
    static async getAll(): Promise<PoolInterface[]> {
        try {
            const response = await axios.get<PoolInterface[]>(API_URL);
            const pools = response.data;

            console.log("Fetched Pools: ", pools);

            const tokenDetailsPromises = pools.map(async (pool) => {
                console.log("Processing pool: ", pool);

                if (!pool.tokenA || !pool.tokenB) {
                    console.error("Missing TokenA or TokenB in pool: ", pool);
                    return null;
                }

                try {
                    console.log("Fetching token details for: ", pool.tokenA, pool.tokenB);

                    const tokenAResponse = await axios.get<TokenInterface>(`${TOKEN_API_URL}/${pool.tokenA}`);
                    const tokenBResponse = await axios.get<TokenInterface>(`${TOKEN_API_URL}/${pool.tokenB}`);

                    console.log("Fetched token details: ", tokenAResponse.data, tokenBResponse.data);

                    // Ensure token data is valid
                    if (!tokenAResponse.data || !tokenBResponse.data) {
                        console.error("Invalid token data for pool: ", pool);
                        return null;
                    }

                    const completePool: PoolInterface = {
                        ...pool,
                        tokenA: tokenAResponse.data,
                        tokenB: tokenBResponse.data,
                    };

                    console.log("Complete Pool: ", completePool);

                    return completePool;
                } catch (error) {
                    console.error("Error fetching token details for pool: ", pool, error);
                    return null;
                }
            });

            const resolvedPools = await Promise.all(tokenDetailsPromises);

            // Use a type guard to filter out null values and ensure tokenA and tokenB are defined
            const validPools = resolvedPools.filter((pool): pool is PoolInterface & { tokenA: TokenInterface; tokenB: TokenInterface } => {
                return pool !== null && pool.tokenA !== undefined && pool.tokenB !== undefined;
            });

            console.log("Resolved Pools with Token Details: ", validPools);
            return validPools;
        } catch (error) {
            console.error("Error fetching pools: ", error);
            return [];
        }
    }

    static async getTokenDetails(tokenAddress: string): Promise<TokenInterface> {
        const response = await axios.get<TokenInterface>(`${TOKEN_API_URL}/${tokenAddress}`);
        return response.data;
    }

    static async getById(id: number): Promise<PoolInterface> {
        const response = await axios.get<PoolInterface>(`${API_URL}/${id}`);
        return response.data;
    }

    static async create(pool: CreatePoolInterface): Promise<PoolInterface> {
        const response = await axios.post<PoolInterface>(API_URL, pool);
        return response.data;
    }

    static async update(id: number, pool: PoolInterface) {
        const response = await axios.put(`${API_URL}/${id}`, pool);
        return response.data;
    }
}

export default PoolService;
