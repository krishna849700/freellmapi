import type { VercelRequest, VercelResponse } from '@vercel/node';

let appInstance: any = null;

async function getApp() {
  if (!appInstance) {
    const { createApp } = await import('../server/src/app.js');
    const { initDb } = await import('../server/src/db/index.js');
    const { loadConfig } = await import('../server/src/lib/config.js');
    const { applyDeclarativeConfigFromEnv } = await import('../server/src/services/declarative-config.js');

    const config = loadConfig();
    config.dbPath = process.env.FREEAPI_DB_PATH || '/tmp/freeapi.db';
    initDb(config.dbPath);
    applyDeclarativeConfigFromEnv();
    appInstance = createApp(config);
  }
  return appInstance;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await getApp();
  return app(req, res);
}
