import jwt from 'jsonwebtoken';
import { CONFIG } from '../config';
import { User } from '../models/User';
import { ErrorAuthInvalidToken } from './errors';
import { TokenResult } from '../gql/resolvers/OAuthResolver';
import { CreateUser } from '../services/UserService';

export interface JWTUser extends CreateUser {
  id: string;
}

interface JWTData {
  fingerprint: string;
  user: JWTUser;
}

export interface JWTVerifyResult extends JWTData {
  iat: string;
  exp: number;
}


/**
 * Creates a new access token
 * @param data JWT Data to encrypt (contains the user data)
 * @param expiresIn Time for the JWT to expire
 */
export const createToken = async (
  data: JWTData,
  expiresIn = '15m',
): Promise<{ token: string, expiry: number }> => {
  const token = jwt.sign(data, CONFIG.accessTokenSecret, { expiresIn });
  const expiry = (jwt.decode(token) as JWTVerifyResult).exp;
  return { token, expiry };
};


// TODO: Invalidate token with redis
// /**
//  * Removes a JWT from Redis, thus preventing further verification for it
//  * @param token JWT to remove
//  */
// export const invalidateToken = async (token: string): Promise<number> =>
//   await redis.srem(CONFIG.redisKeys.accessToken, token);


/**
 * Attempt to verify the token is a valid JWT.
 * If successful, it returns the JWT Data (including the user)
 * @param token JWT to verify
 */
export const verifyToken = async (
  fingerprint: string,
  token: string
): Promise<JWTData> => {

  let data;
  try {
    data = jwt.verify(token, CONFIG.accessTokenSecret) as JWTVerifyResult;
  } catch (e) {
    throw new ErrorAuthInvalidToken();
  }

  // NOTE: Potentially may want to invalidate this JWT too, to prevent it's reuse
  if (data.fingerprint !== fingerprint) throw new ErrorAuthInvalidToken();

  return data;
};


/**
 * Helper function to generate the access token for the
 * current user.
 * @param fingerprint Unique fingerprint of the requesting client
 * @param user User data to encrypt for future requests
 * @param defaultOrganization Whether this token is for the user's default org
 * @param role The role this user has on the org (could be null if no org)
 * @param organizationId The organization for this token
 */
export const generateToken = async (
  fingerprint: string,
  user: User | JWTUser
): Promise<TokenResult> => {
  const data: JWTData = {
    fingerprint,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      socialId: user.socialId,
      socialPic: user.socialPic
    }
  };
  const { token: accessToken, expiry } = await createToken(data);
  return { accessToken, expiry };
};
