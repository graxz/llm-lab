"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const health_route_js_1 = require("./health.route.js");
function registerRoutes(app) {
    (0, health_route_js_1.registerHealthRoutes)(app);
}
//# sourceMappingURL=index.js.map