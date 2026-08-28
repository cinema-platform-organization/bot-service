import { PROTO_PATHS } from "@cinema-platform/contracts";
import { type AuthServiceClient } from "@cinema-platform/contracts/gen/auth";
import { credentials, loadPackageDefinition } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

import { CONFIG } from "@/config";

const packageDef = loadSync(PROTO_PATHS.AUTH, {
	keepCase: false,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
});

const proto = loadPackageDefinition(packageDef) as unknown as any;

export const authClient: AuthServiceClient = new proto.auth.v1.AuthService(
	CONFIG.AUTH_GRPC_URL,
	credentials.createInsecure(),
);
