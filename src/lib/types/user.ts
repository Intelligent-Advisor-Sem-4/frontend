export enum Gender {
    MALE = "male",
    FEMALE = "female",
    UNDEFINED = "undefined"
}

export enum Role {
    ADMIN = "admin",
    USER = "user"
}

export type TokenPayload = {
    sub: string; // username
    exp: number; // expiration time
    role: Role;
}

export interface User {
    username: string;
    name: string;
    email: string;
    role: Role;
    user_id: string;
    avatar?: string;
    token?: string;
}