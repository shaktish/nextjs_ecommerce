export interface RegisterRequestBody {
    name: string;
    email: string;
    password: string;
}
export interface LoginRequestBody {
    email: string;
    password: string;
}


export interface UserI {
    name: string;
    email: string;
    id: string;
    role: string;
}