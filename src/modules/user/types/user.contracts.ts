import { Request, Response, NextFunction } from "express";
import {
    CreateUser,
    LoginCredentials,
    LoginUser,
    MeDTO,
    RegisterCredentials,
    User,
    UserWithPassword,
    VerifyDTO,
} from "./user.types";
import { Avatar } from "../../../../generated/prisma/client";
import { Image } from "../../../../generated/prisma/client";

export interface UserServiceContract {
    login: (credentials: LoginCredentials) => Promise<{ token: string }>;
    register: (credentials: RegisterCredentials) => Promise<{ message: string; token: string }>;
    me: (dto: MeDTO) => Promise<User>;
    verify: (dto: VerifyDTO, userId: number) => Promise<{ token: string }>;
    updateProfile: (userId: number, data: Partial<User>) => Promise<User>;
}

export type UserWithAvatars = User & {
    avatars: (Avatar & {
        image: Image;
    })[];
};

export interface UserRepositoryContract {
    findByEmailWithPassword: (email: string) => Promise<UserWithPassword | null>;
    findByEmail: (email: string) => Promise<User | null>;
    create: (data: CreateUser) => Promise<User>;
    findById(id: number): Promise<UserWithAvatars | null>;
    verify: (id: number) => Promise<User>;
    findByIdWithPassword: (id: number) => Promise<User>;
}
export interface UserControllerContract {
    login: (
        req: Request<object, { token: string }, LoginCredentials>,
        res: Response<{ token: string }>,
        next: NextFunction,
    ) => void;
    register: (
        req: Request<object, { message: string }, RegisterCredentials>,
        res: Response<{ message: string }>,
        next: NextFunction,
    ) => void;
    me: (
        req: Request<object, User, object, object, LoginUser>,
        res: Response<User, LoginUser>,
        next: NextFunction,
    ) => void;
    verify: (
        req: Request<object, { token: string }, VerifyDTO>,
        res: Response<{ token: string }>,
        next: NextFunction,
    ) => void;
    uploadAvatar: (
        req: Request<object, { avatar: string }, object, any, LoginUser>,
        res: Response<{ avatar: string }, LoginUser>,
        next: NextFunction,
    ) => void;
    updateProfile: (
        req: Request<object, User, Partial<User>, object, LoginUser>,
        res: Response<User, LoginUser>,
        next: NextFunction,
    ) => void;
}
