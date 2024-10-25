import NextAuth from "next-auth"
import Spotify from "next-auth/providers/spotify"
import "next-auth/jwt"
import { refreshAccessToken } from "./app/actions/actions";

const scopes = [
    'user-read-private',
    'user-read-email',
    'user-modify-playback-state',
].join(",");

const params = {
    scope: scopes,
}

const AUTHORIZE_URL = "https://accounts.spotify.com/authorize?" + (new URLSearchParams(params)).toString();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Spotify({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        authorization: AUTHORIZE_URL,
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({token, account, session}) {
        if (account) {
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
          const expiresAt = account.expires_at ?? 0;
          token.accessTokenExpires = Date.now() + 60*1000;
          console.log(token.accessTokenExpires);
          console.log(Date.now());
          return token;
        }

        if (Date.now() < token.accessTokenExpires) {
          return token
        }
        
        return await refreshAccessToken(token.accessToken, token.refreshToken);
        
    },
    async session({session, token}) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;

        return session;
    }
  }
})

declare module "next-auth" {
    interface Session {
      accessToken?: string,
      refreshToken?: string,
    }
  }
  
  declare module "next-auth/jwt" {
    interface JWT {
      accessToken?: string,
      refreshToken?: string,
      accessTokenExpires: number,
    }
  }