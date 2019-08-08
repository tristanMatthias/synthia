import { config } from 'dotenv';
import path from 'path';

import { API_CONFIG } from './types';


/*******************************************************************************
 *
 *              ! DO NOT PUT ANYTHING SECURE IN THESE FILES !
 *
 ******************************************************************************/

config({
  path: process.env.ENV || path.resolve(process.cwd(), '.env')
});

export const CONFIG_BASE: Partial<API_CONFIG> = {
  port: parseInt(process.env.PORT!) || 4000,
  clientHost: 'https://synthia.app',
  dbConnection: {
    database: process.env.DB_DATABASE!,
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!)
  },
  accessTokenSecret: process.env.JWT_SECRET,

  oauth: {
    facebook: {
      appId: process.env.FACEBOOK_APP_ID!,
      appSecret: process.env.FACEBOOK_APP_SECRET!
    },
    google: {
      appId: process.env.GOOGLE_APP_ID!,
      appSecret: process.env.GOOGLE_APP_SECRET!
    }
  }
};
