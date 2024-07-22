export interface TokenInterface {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  name: string;
  symbole: string;
  price: number;
  logo: string;
  address: string;
  pools: string;
  trades: number;
}