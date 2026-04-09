import { StringValue } from "ms";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { LoginError, ConflictError, NotFoundError } from "../../errors/app.errors";
import { UserServiceContract } from "./types/user.contracts";
import { UserRepository } from "./user.repository";

export const UserService: UserServiceContract = {
	async login(credentials) {
		const user = await UserRepository.findByEmailWithPassword(credentials.email);
		if (!user) {
			throw new NotFoundError("User");
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

		const createdUser = await UserRepository.create({
			...credentials,
			password: hashedPassword,
		});

		const token = jwt.sign({ id: createdUser.id }, env.SECRET_KEY, {
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
};