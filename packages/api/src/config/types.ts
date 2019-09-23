export type API_CONFIG = {
  env: Env;
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
  },
  s3: {
    region: string;
    key: string;
    secret: string;
    bucket: string;
  }

  accessTokenSecret: string,

  corsAllowFrom: boolean | string | RegExp | (string | RegExp)[]

  localUploadDir: string;
};

export enum Env {
  development = 'development',
  production = 'production'
}
