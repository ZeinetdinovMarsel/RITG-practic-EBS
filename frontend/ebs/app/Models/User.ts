import { Role } from "../enums/Role";

export interface User{
    userId: string;
    username: string;
    password: string;
    email:string;
    isAdmin:boolean;
}