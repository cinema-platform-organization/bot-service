// sort-imports-ignore
import { otelSdk } from "./tracing";

import { createBot } from "./modules/bot/bot.factory";
import { logger } from "./shared/logger";

async function bootstrap() {
	let bot: ReturnType<typeof createBot>;

	try {
		bot = createBot();
	} catch (error) {
		logger.fatal({ err: error }, "Failed to create bot");
		process.exit(1);
	}

	bot.launch(() => logger.info("Telegram bot started")).catch(error => {
		logger.fatal({ err: error }, "Bot stopped with an error");
		process.exit(1);
	});

	const shutdown = (signal: string) => {
		logger.info({ signal }, "Shutting down bot");
		bot.stop(signal);
		void otelSdk.shutdown().finally(() => process.exit(0));
	};

	process.once("SIGINT", () => shutdown("SIGINT"));
	process.once("SIGTERM", () => shutdown("SIGTERM"));
}

void bootstrap();
