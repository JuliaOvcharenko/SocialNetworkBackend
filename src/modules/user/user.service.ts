import { StringValue } from "ms";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { LoginError, ConflictError, NotFoundError, BadRequestError } from "../../errors/app.errors";
import { UserServiceContract } from "./types/user.contracts";
import { UserRepository } from "./user.repository";
import { MailService } from "./mail.service";
import { PrismaClient } from "../../prisma/client";

function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const UserService: UserServiceContract = {
    async login(credentials) {
        const user = await UserRepository.findByEmailWithPassword(credentials.email);
        if (!user) {
            throw new NotFoundError("User");
        }

        if (!user.isVerified) {
            throw new LoginError("Email is not verified");
        }

        const isMatched = await compare(credentials.password, user.password);
        if (!isMatched) {
            throw new LoginError("Passwords do not match");
        }

        const token = jwt.sign({ id: user.id }, env.SECRET_KEY, {
            expiresIn: env.TOKEN_TTL as StringValue,
        });

        return { token };
    },

    async register(credentials) {
        const existingUser = await UserRepository.findByEmail(credentials.email);
        if (existingUser) {
            throw new ConflictError("User with such email");
        }

        const hashedPassword = await hash(credentials.password, 10);
        const code = generateCode();

        const user = await UserRepository.create({
            ...credentials,
            password: hashedPassword,
            verificationCode: code,
        });

        await MailService.sendVerificationCode(credentials.email, code);

        const token = jwt.sign({ id: user.id }, env.SECRET_KEY, {
            expiresIn: env.TOKEN_TTL as StringValue,
        });

        return { message: "Verification code sent to your email", token };
    },

    async verify(dto, userId) {
        const user = await UserRepository.findByIdWithPassword(userId);

        if (user.verificationCode !== dto.code) {
            throw new BadRequestError("Invalid verification code");
        }

        await UserRepository.verify(userId);

        const token = jwt.sign({ id: userId }, env.SECRET_KEY, {
            expiresIn: env.TOKEN_TTL as StringValue,
        });

        return { token };
    },

    async me(dto) {
        const user = await UserRepository.findById(dto.userId);
        if (!user) {
            throw new NotFoundError("User");
        }

        return user;
    },

    async uploadAvatar(userId: number, file?: Express.Multer.File) {
        if (!file) {
            throw new BadRequestError("No image file provided");
        }

        const avatarUrl = `/uploads/shakal/${file.filename}`;

        // Снимаем флаг "главная аватарка" у всех текущих аватарок пользователя
        await PrismaClient.userAvatar.updateMany({
            where: { userId: userId },
            data: { isMain: false }
        });

        // Создаем новую запись для аватарки и устанавливаем ее как главную
        const newAvatar = await PrismaClient.userAvatar.create({
            data: {
                userId: userId,
                url: avatarUrl,
                isMain: true
            }
        });

        return { avatar: newAvatar.url };
    }
};