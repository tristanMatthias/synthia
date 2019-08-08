import 'reflect-metadata';

import express from 'express';
import helmet from 'helmet';
import http, { Server } from 'http';

import { CONFIG } from '../config';
import { setupDatabase } from '../database/database';
import { logger } from '../lib/logger';
import { apollo } from './middleware/apollo';
import { facebook } from './middleware/oauth/facebook';


let httpServer: Server;


export const startServer = async (
  port: number = CONFIG.port,
  database?: string
) => {

  const db = await setupDatabase(database);

  const app = express();
  httpServer = http.createServer(app);

  app.use(helmet());
  apollo(app, httpServer);

  app.use(facebook.router);


  await new Promise(res => httpServer.listen(port, res));
  logger.info(`🚀 Server ready at http://localhost:${port}/graphql`);


  return { httpServer, db };
};


// File is called from command line
if (require.main === module) startServer();
