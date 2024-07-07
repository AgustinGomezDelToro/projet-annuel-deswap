import { TransactionsInterface } from "./Transactions";

export interface PoolInterface {
    id: number;
    token1: string;
    token2: string;
    logoURL1: string;
    logoURL2: string;
    tvl: number;
    volume24h: number;
    volume7d: number;
    fees24h: number;
    price1: number;
    price2: number;
    token1Balance: number;
    token2Balance: number;
    transactions: TransactionsInterface[];
}