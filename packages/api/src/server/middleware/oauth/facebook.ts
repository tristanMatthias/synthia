import { CONFIG } from "../../../config";
import { OAuthProvider } from "../../../lib/OAuthProvider";

export const facebook = new OAuthProvider({
  provider: 'facebook',
  host: CONFIG.clientHost,
  clientID: CONFIG.oauth.facebook.appId,
  clientSecret: CONFIG.oauth.facebook.appSecret,
  authenticateURL: 'https://www.facebook.com/v3.2/dialog/oauth',
  getTokenURL: 'https://graph.facebook.com/v3.2/oauth/access_token',
  getUserURL: 'https://graph.facebook.com/v3.2/me',
  getUserQueryString: {
    fields: 'id,email,first_name,last_name,picture'
  },
  mapUserData: {
    socialId: 'id',
    firstName: 'first_name',
    lastName: 'last_name',
    email: 'email',
    socialPic: 'picture.data.url'
  }
});
