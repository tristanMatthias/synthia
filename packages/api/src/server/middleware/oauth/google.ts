import { CONFIG } from "../../../config";
import { OAuthProvider } from "../../../lib/OAuthProvider";

export const google = new OAuthProvider({
  provider: 'google',
  host: CONFIG.clientHost,
  clientID: CONFIG.oauth.google.appId,
  clientSecret: CONFIG.oauth.google.appSecret,
  authenticateURL: 'https://accounts.google.com/o/oauth2/v2/auth',
  authenticateQueryString: {
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/userinfo.profile+https://www.googleapis.com/auth/userinfo.email'
  },
  getTokenURL: 'https://www.googleapis.com/oauth2/v4/token',
  getUserURL: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
  mapUserData: {
    socialId: 'id',
    firstName: 'given_name',
    lastName: 'family_name',
    email: 'email',
    socialPic: 'picture',
  }
});
