export type LoginResponse = {
    username: string;
    token: string;
    role: string;
    name: string;
    email: string;
    user_id: string;
    avatar?: string;
}

export interface ValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
}

export interface HTTPValidationError {
    detail: ValidationError[];
}

export interface User {
    username: string;
    name: string;
    email: string;
    avatar?: string;
}

export enum Gender {
    MALE = "male",
    FEMALE = "female",
    UNDEFINED = "undefined"
}
