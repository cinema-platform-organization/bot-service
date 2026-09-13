import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
	const envName = process.env.NODE_ENV || "development";
	const envFileName = `.env.${envName}.local`;
	const envPath = path.resolve(process.cwd(), envFileName);

	if (fs.existsSync(envPath)) {
		dotenv.config({ path: envPath });
		console.log(`[Config] Loaded environment from ${envFileName}`);
	} else {
		const fallbackPath = path.resolve(process.cwd(), ".env");
		if (fs.existsSync(fallbackPath)) {
			dotenv.config({ path: fallbackPath });
			console.log(`[Config] Loaded fallback environment from .env`);
		}
	}
} else {
	console.log(
		"[Config] Running in production. Using environment variables injected by Docker.",
	);
}

export const CONFIG = {
	BOT_TOKEN: process.env.BOT_TOKEN,
	AUTH_GRPC_URL: process.env.AUTH_GRPC_URL,
};
