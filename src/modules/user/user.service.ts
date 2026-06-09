import { StringValue } from "ms";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { LoginError, ConflictError, NotFoundError, BadRequestError } from "../../errors/app.errors";
import { UserServiceContract, UserWithAvatars, UpdateProfileDTO } from "./types/user.contracts";
import { UserRepository } from "./user.repository";
import { MailService } from "./mail.service";
import { prisma } from "../../prisma/client";

function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const blacklistedTokens = new Set<string>();
const verificationCodes = new Map<number, string>();

export const UserService: UserServiceContract = {
    async login(credentials) {
        const user = await UserRepository.findByEmailWithPassword(credentials.email);
        if (!user) {
            throw new NotFoundError("User");
        }

        if (!user.isActive) {
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
        const user = await UserRepository.create({
            email: credentials.email,
            password: hashedPassword,
            isSuperuser: false,
            isStaff: false,
            isActive: false,
            dateJoined: new Date(),
            firstName: "",
            lastName: "",
        });

        const userId = Number(user.id);

        const profile = await prisma.profile.create({
            data: {
                userId: BigInt(userId),
                is_text_signature: true,
                is_image_signature: true,
            },
        });

        await prisma.album.create({
            data: {
                name: "Avatars",
                theme: "default",
                year: new Date().getFullYear(),
                isShown: false,
                isDefault: true,
                profileId: profile.id,
                createdAt: new Date(),
            },
        });

        const code = generateCode();
        verificationCodes.set(userId, code);
        await MailService.sendVerificationCode(credentials.email, code);

        const token = jwt.sign({ id: userId }, env.SECRET_KEY, {
            expiresIn: env.TOKEN_TTL as StringValue,
        });

        return { message: "Verification code sent to your email", token };
    },

    async verify(dto, userId) {
        const storedCode = verificationCodes.get(userId);

        if (!storedCode || storedCode !== dto.code) {
            throw new BadRequestError("Invalid verification code");
        }

        verificationCodes.delete(userId);

        await prisma.user.update({
            where: { id: userId },
            data: { isActive: true },
        });

        const token = jwt.sign({ id: userId }, env.SECRET_KEY, {
            expiresIn: env.TOKEN_TTL as StringValue,
        });

        const updatedUser = await UserRepository.findById(userId);

        return { token, user: updatedUser };
    },

    async me(dto) {
        const user = await UserRepository.findById(dto.userId);
        if (!user) {
            throw new NotFoundError("User");
        }

        return user;
    },

    async updateProfile(userId: number, data: UpdateProfileDTO) {
        const { birthDate, pseudonym, avatar, firstName, lastName, username, signature } = data;

        if (username) {
            const existing = await prisma.user.findUnique({ where: { username } });
            if (existing && Number(existing.id) !== userId) {
                throw new ConflictError("User with such username");
            }
        }

        await prisma.user.update({
            where: { id: BigInt(userId) },
            data: {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(username && { username }),
                ...(signature && { signature }),
            },
        });

        const profileData: any = {};
        if (birthDate) {
            const [day, month, year] = birthDate.split(".");
            profileData.birthDate = new Date(`${year}-${month}-${day}`).toISOString();
        }
        if (pseudonym) profileData.pseudonym = pseudonym;
        if (avatar) profileData.avatar = avatar;

        if (Object.keys(profileData).length > 0) {
            await prisma.profile.update({
                where: { userId: BigInt(userId) },
                data: profileData,
            });
        }

        const updatedUser = await UserRepository.findById(userId);
        if (!updatedUser) throw new NotFoundError("User");
        return updatedUser;
    },

    logout: async (token: string): Promise<{ message: string }> => {
        blacklistedTokens.add(token);
        return { message: "Logged out successfully" };
    },

    isTokenBlacklisted: (token: string): boolean => {
        return blacklistedTokens.has(token);
    },

    getById: async (userId: number): Promise<UserWithAvatars> => {
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new NotFoundError("User");
        }
        return user;
    },
};
