import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { UserRepositoryContract } from "./types/user.contracts";
import { InternalServerError, NotFoundError } from "../../errors/app.errors";
import { prisma } from "../../prisma/client";

export const UserRepository: UserRepositoryContract = {
    async findByEmailWithPassword(email) {
        try {
            return await prisma.user.findFirst({ where: { email } });
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
            return await prisma.user.create({
                data: {
                    email: data.email,
                    password: data.password,
                    isSuperuser: false,
                    isStaff: false,
                    isActive: false,
                    dateJoined: new Date(),
                    firstName: "",
                    lastName: "",
                },
                omit: { password: true },
            });
        } catch (error) {
            throw handlePrismaError(error);
        }
    },

    async findById(id: number) {
        try {
            return await prisma.user.findUnique({
                where: { id },
                omit: { password: true },
                include: {
                    profile: {
                        include: {
                            albums: {
                                include: {
                                    images: true,
                                },
                            },
                        },
                    },
                },
            });
        } catch (error) {
            throw handlePrismaError(error);
        }
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
    console.error("PRISMA ERROR:", error);
    if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
            return new NotFoundError("User");
        }
        return new InternalServerError(`DB_ERROR: ${error.code}`);
    }
    return new InternalServerError();
}
