import { PoolInterface } from "../interfaces/Pools";
import { TransactionsInterface } from "../interfaces/Transactions";

export async function GetAllPools() {
    const transactions : TransactionsInterface[] = [
        {
            id: 1,
            tokenIn: "BTC",
            tokenOut: "ETH",
            value: 200000,
            tokenAmountIn: 50,
            tokenAmountOut: 1500,
            from: "0xabcdef1234",
            timestamp: "2022-07-01 14:30:00"
        },
        {
            id: 2,
            tokenIn: "ETH",
            tokenOut: "BTC",
            value: 300000,
            tokenAmountIn: 200,
            tokenAmountOut: 800,
            from: "0xabcdef5678",
            timestamp: "2022-07-02 15:45:00"
        },
        {
            id: 3,
            tokenIn: "BTC",
            tokenOut: "ETH",
            value: 150000,
            tokenAmountIn: 30,
            tokenAmountOut: 600,
            from: "0xabcdef9101",
            timestamp: "2022-07-03 16:00:00",
        },
        {
            id: 4,
            tokenIn: "ETH",
            tokenOut: "BTC",
            value: 120000,
            tokenAmountIn: 60,
            tokenAmountOut: 500,
            from: "0xabcdef1122",
            timestamp: "2022-07-04 17:15:00",
        }
    ];
    const pools: PoolInterface[] = [
        {
            id: 1,
            token1: "BTC",
            token2: "ETH",
            logoURL1: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
            logoURL2: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
            tvl: 1200000000,
            volume24h: 150000000,
            volume7d: 600000000,
            fees24h: 120000,
            price1: 48000,
            price2: 3100,
            token1Balance: 90000,
            token2Balance: 950000,
            transactions
        },
        {
            id: 2,
            token1: "BTC",
            token2: "BNB",
            logoURL1: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
            logoURL2: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
            tvl: 600000000,
            volume24h: 60000000,
            volume7d: 300000000,
            fees24h: 60000,
            price1: 49000,
            price2: 520,
            token1Balance: 95000,
            token2Balance: 1050000,
            transactions
        },
        {
            id: 3,
            token1: "ETH",
            token2: "BNB",
            logoURL1: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
            logoURL2: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
            tvl: 110000000,
            volume24h: 11000000,
            volume7d: 55000000,
            fees24h: 110000,
            price1: 3200,
            price2: 530,
            token1Balance: 110000,
            token2Balance: 1100000,
            transactions
        },
    ];
    return pools;
}

export async function GetPoolById(id: number) {
    const pools = await GetAllPools();
    return pools.find((pool) => pool.id === id);
}
