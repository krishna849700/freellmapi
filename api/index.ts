import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../server/src/app.js';
import { initDb } from '../server/src/db/index.js';
import { loadConfig } from '../server/src/lib/config.js';
import { applyDeclarativeConfigFromEnv } from '../server/src/services/declarative-config.js';

let appInstance: ReturnType<typeof createApp> | null = null;

function getApp() {
  if (!appInstance) {
    const config = loadConfig();
    config.dbPath = process.env.FREEAPI_DB_PATH || '/tmp/freeapi.db';
    initDb(config.dbPath);
    applyDeclarativeConfigFromEnv();
    appInstance = createApp(config);
  }
  return appInstance;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const app = getApp();
  return app(req, res);
}
