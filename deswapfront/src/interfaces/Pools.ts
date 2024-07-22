import { TokenInterface } from "./Tokens";

export interface PoolInterface {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    TokenA: string;
    TokenB: string;
    supplyA: number;
    supplyB: number;
    poolAddress: string;
    tokenA?: TokenInterface;
    tokenB?: TokenInterface;
}
