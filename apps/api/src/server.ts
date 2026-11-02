import { buildApp } from './app.js';

async function startServer(): Promise<void> {
    const app = buildApp();

    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    const host = process.env.HOST || '0.0.0.0';

    try {
        await app.listen({
            port,
            host
        });

    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

void startServer();