import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { UserRepositoryContract } from "./types/user.contracts";
import { InternalServerError, NotFoundError } from "../../errors/app.errors";
import { prisma } from "../../prisma/client";


export const UserRepository: UserRepositoryContract = {
    async findByEmailWithPassword(email) {
        try {
            return await prisma.user.findFirst({
                where: { email },
            });
        } catch (error) {
            throw handlePrismaError(error);
        }
    },

    async findByEmail(email) {
        try {
            return await prisma.user.findFirst({
                where: { email },
                omit: { password: true },
            });
        } catch (error) {
            throw handlePrismaError(error);
        }
    },

    async create(data) {
        try {
            return await prisma.user.create({ data });
        } catch (error) {
            throw handlePrismaError(error);
        }
    },

    async findById(id: number) {
        const findedUser = await prisma.user.findUnique({
            where: { id },
            include: {
                avatars: {
                    where: { isShown: true },
                    include: { image: true },
                    orderBy: [
                        { isActive: 'desc' },
                        { id: 'desc' }
                    ]
                },
                album: {
                    include: {
                        images: {
                            include: { image: true }
                        },
                        avatars: {
                            include: { avatar: { include: { image: true } } }
                        },
                    }
                }
            }
        });
        return findedUser
    },
    async verify(id: number) {
        return prisma.user.update({
            where: { id },
            data: { isVerified: true, verificationCode: null },
            omit: { password: true },
        });
    },
    async findByIdWithPassword(id: number) {
        try {
            return await prisma.user.findFirstOrThrow({ where: { id } });
        } catch (error) {
            throw handlePrismaError(error);
        }
    },
};

function handlePrismaError(error: unknown): Error {
    if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
            return new NotFoundError("Album");
        }
        return new InternalServerError(`DB_ERROR: ${error.code}`);
    }
    return new InternalServerError();
}