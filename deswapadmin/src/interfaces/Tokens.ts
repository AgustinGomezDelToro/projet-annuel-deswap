export interface IToken {
    ID: number;
    name: string;
    symbole: string;
    logo: string;
    address: string;
    pools: string[];
    price: Float32Array;
    trades: number;
}