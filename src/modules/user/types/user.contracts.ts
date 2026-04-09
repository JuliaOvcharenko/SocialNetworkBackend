import {Request, Response, NextFunction} from "express";
import { CreateUser, LoginCredentials, LoginUser, MeDTO, RegisterCredentials, User, UserWithPassword } from "./user.types";


export interface UserServiceContract {
    login: (credentials: LoginCredentials) => Promise<{ token: string }>;
    register: (credentials: RegisterCredentials,) => Promise<{token: string }>;
    me: (dto: MeDTO) => Promise<User>;
}

export interface UserRepositoryContract {
    findByEmailWithPassword: (email: string,) => Promise<UserWithPassword | null>;
    findByEmail: (email: string) => Promise<User | null>;
    create: (data: CreateUser) => Promise<User>;
    findById: (id: number) => Promise<User>;
}

export interface UserControllerContract {
    login: (
        req: Request<object, { token: string }, LoginCredentials>,
        res: Response<{ token: string }>,
        next: NextFunction
	) => void;
    register: (
        req: Request<object, { token: string }, RegisterCredentials>,
        res: Response<{ token: string }>,
		next: NextFunction
    ) => void;
    me: (
        req: Request<object, User, object, object, LoginUser>,
        res: Response<User, LoginUser>,
		next: NextFunction
    ) => void;
}