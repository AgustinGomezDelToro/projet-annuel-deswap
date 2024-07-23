export interface IUser {
    ID: string;
    public_key: string,
    signature: string,
    role: string,
    status: string,
    swap: number
    is_banned: boolean;
    number_of_transactions: number;
    is_admin: boolean;
    has_signed_message: boolean;
}