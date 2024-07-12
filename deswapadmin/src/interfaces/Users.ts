export interface IUser {
    ID: string;
    public_key: string,
    signature: string,
    role: string,
    status: string,
    is_banned: boolean,
    is_admin: boolean
}