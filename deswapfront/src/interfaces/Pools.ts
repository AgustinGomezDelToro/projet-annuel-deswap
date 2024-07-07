import { TokenInterface } from "./Tokens";
import { TransactionsInterface } from "./Transactions";

export interface PoolInterface {
    address: string;
    token1: TokenInterface;
    token2: TokenInterface;
}