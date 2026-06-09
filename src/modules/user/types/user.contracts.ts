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
import { Prisma } from "../../../../generated/prisma/client";

export type ProfileWithAlbums = Prisma.ProfileGetPayload<{
    include: {
        albums: {
            include: {
                images: true;
            };
        };
    };
}>;

export type UserWithAvatars = User & {
    profile: ProfileWithAlbums | null;
};

export interface UpdateProfileDTO {
    firstName?: string;
    lastName?: string;
    username?: string;
    signature?: string;
    birthDate?: string;
    pseudonym?: string;
    avatar?: string;
}

export interface UserServiceContract {
    login: (credentials: LoginCredentials) => Promise<{ token: string }>;
    register: (credentials: RegisterCredentials) => Promise<{ message: string; token: string }>;
    me: (dto: MeDTO) => Promise<UserWithAvatars>;
    verify: (dto: VerifyDTO, userId: number) => Promise<{ token: string; user: UserWithAvatars | null }>;
    updateProfile: (userId: number, data: UpdateProfileDTO) => Promise<UserWithAvatars>;
    logout: (token: string) => Promise<{ message: string }>;
    isTokenBlacklisted: (token: string) => boolean;
    getById: (userId: number) => Promise<UserWithAvatars>;
}

export interface UserRepositoryContract {
    findByEmailWithPassword: (email: string) => Promise<UserWithPassword | null>;
    findByEmail: (email: string) => Promise<User | null>;
    create: (data: CreateUser) => Promise<User>;
    findById: (id: number) => Promise<UserWithAvatars | null>;
    findByIdWithPassword: (id: number) => Promise<UserWithPassword>;
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
        req: Request<object, UserWithAvatars, object, object, LoginUser>,
        res: Response<UserWithAvatars, LoginUser>,
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
        req: Request<object, UserWithAvatars, UpdateProfileDTO, object, LoginUser>,
        res: Response<UserWithAvatars, LoginUser>,
        next: NextFunction,
    ) => void;
    logout: (
        req: Request<object, { message: string }, object, object, LoginUser>,
        res: Response<{ message: string }, LoginUser>,
        next: NextFunction,
    ) => void;
    getById: (
        req: Request<{ id: string }, UserWithAvatars, object, object, LoginUser>,
        res: Response<UserWithAvatars, LoginUser>,
        next: NextFunction,
    ) => void;
}