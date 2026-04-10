import { cleanEnv, num, str } from "envalid";
import { config } from "dotenv";
config();

export const env = cleanEnv(process.env, {
	PORT: num({ default: 8001 }),
	HOST: str({ default: "localhost" }),
	DATABASE_URL: str(),
	SECRET_KEY: str(),
	TOKEN_TTL: str({ default: "7d" }),
	HOST_EMAIL_ADDRESS: str(),
	HOST_EMAIL_PASSWORD: str(),
});