import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

export const logger = pino({
	level: process.env.LOG_LEVEL ?? (isProd ? "info" : "debug"),
	base: { service: "bot-service" },
	transport: isProd
		? undefined
		: { target: "pino-pretty", options: { singleLine: true } },
});
