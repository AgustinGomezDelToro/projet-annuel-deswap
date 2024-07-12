// services/Token.ts
import { IToken } from "../interfaces/Tokens";

class TokenService {
    private baseUrl = "http://localhost:3001/tokens";

    async getAll(): Promise<IToken[]> {
        const response = await fetch(this.baseUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch tokens");
        }
        return await response.json();
    }

    async create(name: string, symbole: string, price: number, address: string, logo: string, pools: string, trades: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/add`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, symbole, price, address, logo, pools, trades }),
        });
        if (!response.ok) {
            throw new Error("Failed to create token");
        }
    }

    async update(id: number, name: string, symbole: string, price: number, address: string, logo: string, pools: string, trades: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/update`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, name, symbole, price, address, logo, pools, trades }),
        });
        if (!response.ok) {
            throw new Error("Failed to update token");
        }
    }

    async delete(address: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${address}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Failed to delete token");
        }
    }
}

export default TokenService;
