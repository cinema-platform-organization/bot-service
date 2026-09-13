import * as dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}.local` });

export const CONFIG = {
	BOT_TOKEN: process.env.BOT_TOKEN,
	AUTH_GRPC_URL: process.env.AUTH_GRPC_URL,
};
