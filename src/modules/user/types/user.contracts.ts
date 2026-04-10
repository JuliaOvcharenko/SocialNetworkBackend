import {Request, Response, NextFunction} from "express";
import { CreateUser, LoginCredentials, LoginUser, MeDTO, RegisterCredentials, User, UserWithPassword, VerifyDTO } from "./user.types";


export interface UserServiceContract {
    login: (credentials: LoginCredentials) => Promise<{ token: string }>;
    register: (credentials: RegisterCredentials) => Promise<{ message: string }>;
    me: (dto: MeDTO) => Promise<User>;
    verify: (dto: VerifyDTO) => Promise<{ token: string }>;
}

export interface UserRepositoryContract {
    findByEmailWithPassword: (email: string,) => Promise<UserWithPassword | null>;
    findByEmail: (email: string) => Promise<User | null>;
    create: (data: CreateUser) => Promise<User>;
    findById: (id: number) => Promise<User>;
    verify: (id: number) => Promise<User>;
}

export interface UserControllerContract {
    login: (
        req: Request<object, { token: string }, LoginCredentials>,
        res: Response<{ token: string }>,
        next: NextFunction
	) => void;
    register: (
        req: Request<object, { message: string }, RegisterCredentials>,
        res: Response<{ message: string }>,
        next: NextFunction
    ) => void;
    me: (
        req: Request<object, User, object, object, LoginUser>,
        res: Response<User, LoginUser>,
		next: NextFunction
    ) => void;
    verify: (
        req: Request<object, { token: string }, VerifyDTO>,
        res: Response<{ token: string }>,
        next: NextFunction
    ) => void;
}