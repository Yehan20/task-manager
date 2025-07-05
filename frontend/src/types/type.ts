export interface UserInfo {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface NewUser {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}
