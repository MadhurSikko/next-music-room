import NextAuth from "next-auth"
import Spotify from "next-auth/providers/spotify"
import "next-auth/jwt"

const scopes = [
    'user-read-private',
    'user-read-email'
].join(",");

const params = {
    scope: scopes,
}

const AUTHORIZE_URL = "https://accounts.spotify.com/authorize?" + (new URLSearchParams(params)).toString();

const config = {
    
}

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

    async jwt({token, account}) {
        if (account) {
            return {...token, accessToken: account.access_token, refreshToken: account.refresh_token}
        }
        return token;

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
    }
  }