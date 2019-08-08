export type API_CONFIG = {
  port: number,
  clientHost: string,

  dbConnection: {
    database: string
    username: string
    password: string
    host: string
    port: number
  };

  oauth: {
    facebook: {
      appId: string;
      appSecret: string;
    }
    google: {
      appId: string;
      appSecret: string;
    }
  }

  accessTokenSecret: string,

  corsAllowFrom: boolean | string | RegExp | (string | RegExp)[]
};
