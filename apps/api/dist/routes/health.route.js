"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHealthRoutes = registerHealthRoutes;
function registerHealthRoutes(app) {
    app.get('/health', async () => {
        return {
            status: 'ok',
            service: 'api',
        };
    });
}
//# sourceMappingURL=health.route.js.map