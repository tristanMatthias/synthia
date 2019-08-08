import { Arg, Ctx, Field, ObjectType, Query, Resolver } from 'type-graphql';

import { Context } from '../../lib/context';
import { OAuthProvider } from '../../lib/OAuthProvider';
import { generateToken } from '../../lib/tokens';
import { facebook } from '../../server/middleware/oauth/facebook';
import { google } from '../../server/middleware/oauth/google';
import { UserService } from '../../services/UserService';

@ObjectType()
export class TokenResult {
  @Field()
  accessToken: string
  @Field()
  expiry: number
}

@Resolver()
export class OAuthResolver {
  @Query(() => TokenResult)
  async oauthCallback(
    @Arg('code') code: string,
    @Arg('provider') providerName: string,
    @Ctx() ctx: Context
  ): Promise<TokenResult> {
    let provider: OAuthProvider;
    if (providerName === 'facebook') provider = facebook;
    else if (providerName === 'google') provider = google;
    else throw new Error(`Invalid oauth provider ${providerName}`);

    let {user: socialUser} = await provider.getUser(code);

    const existing = await UserService.findByEmail(socialUser.email);
    const user = existing || await UserService.create(socialUser);

    const token = await generateToken(ctx.fingerprint, user);

    return token;
  }
}
