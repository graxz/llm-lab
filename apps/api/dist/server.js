"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
async function startServer() {
    const app = (0, app_js_1.buildApp)();
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    const host = process.env.HOST || '0.0.0.0';
    try {
        await app.listen({
            port,
            host
        });
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}
void startServer();
//# sourceMappingURL=server.js.map