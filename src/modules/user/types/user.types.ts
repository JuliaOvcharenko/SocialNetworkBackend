import { InferType } from "yup";
import { loginSchema, registerSchema } from "../user.schema";
import { Prisma } from "../../../../generated/prisma/client";

export type User = Prisma.UserGetPayload<{ omit: { password: true } }>;
export type UserWithPassword = Prisma.UserGetPayload<{}>;
export type CreateUser = Prisma.UserUncheckedCreateInput;

export type LoginCredentials = InferType<typeof loginSchema>;
export type RegisterCredentials = InferType<typeof registerSchema>;
export type MeDTO = { userId: number };

export interface TokenData {
    id: number;
}

export interface LoginUser {
    userId: number;
}

export type VerifyDTO = {
    email: string;
    code: string;
};
