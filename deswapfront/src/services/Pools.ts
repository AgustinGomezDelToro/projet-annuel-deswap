import { PoolInterface } from "../interfaces/Pools";
import { TransactionsInterface } from "../interfaces/Transactions";

export async function GetAllPools() {
    const transactions : TransactionsInterface[] = [
        {
            id: 1,
            tokenIn: "BTC",
            tokenOut: "ETH",
            value: 100000,
            tokenAmountIn: 100,
            tokenAmountOut: 1000,
            from: "0x1234567890",
            timestamp: "2021-08-01 12:00:00"
        },
        {
            id: 2,
            tokenIn: "ETH",
            tokenOut: "BTC",
            value: 100000,
            tokenAmountIn: 100,
            tokenAmountOut: 1000,
            from: "0x1234567890",
            timestamp: "2021-08-01 12:00:00"
        },
        {
            id: 3,
            tokenIn: "BTC",
            tokenOut: "ETH",
            value: 100000,
            tokenAmountIn: 100,
            tokenAmountOut: 1000,
            from: "0x1234567890",
            timestamp: "2021-08-01 12:00:00",
        },
        {
            id: 4,
            tokenIn: "ETH",
            tokenOut: "BTC",
            value: 100000,
            tokenAmountIn: 100,
            tokenAmountOut: 1000,
            from: "0x1234567890",
            timestamp: "2021-08-01 12:00:00",
        }
    ];
    const pools: PoolInterface[] = [
        {
            id: 1,
            token1: "BTC",
            token2: "ETH",
            logoURL1: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
            logoURL2: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
            tvl: 1000000000,
            volume24h: 100000000,
            volume7d: 500000000,
            fees24h: 100000,
            price1: 50000,
            price2: 3000,
            token1Balance: 100000,
            token2Balance: 1000000,
            transactions
        },
        {
            id: 2,
            token1: "BTC",
            token2: "BNB",
            logoURL1: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
            logoURL2: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
            tvl: 500000000,
            volume24h: 50000000,
            volume7d: 250000000,
            fees24h: 50000,
            price1: 50000,
            price2: 500,
            token1Balance: 100000,
            token2Balance: 1000000,
            transactions
        },
        {
            id: 3,
            token1: "ETH",
            token2: "BNB",
            logoURL1: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
            logoURL2: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
            tvl: 100000000,
            volume24h: 10000000,
            volume7d: 50000000,
            fees24h: 100000,
            price1: 3000,
            price2: 500,
            token1Balance: 100000,
            token2Balance: 1000000,
            transactions
        },
    ];
    return pools;
}

export async function GetPoolById(id: number) {
    const pools = await GetAllPools();
    return pools.find((pool) => pool.id === id);
}