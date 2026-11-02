"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const index_js_1 = require("./routes/index.js");
function buildApp() {
    const app = (0, fastify_1.default)({
        logger: true,
    });
    (0, index_js_1.registerRoutes)(app);
    return app;
}
//# sourceMappingURL=app.js.map