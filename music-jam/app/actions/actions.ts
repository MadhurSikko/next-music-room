"use server";
import axios from "axios";

/*
export async function refreshAccessToken(token: any, refreshToken: any) {
    console.log(refreshToken);
    try {
        const URL = 'https://accounts.spotify.com/api/token';
        
        const response = await axios.post(URL, null, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
            },
            params: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }
        })

        const refreshedToken = response.data();
        return {
            ...token, 
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now() + refreshedToken.expires_at*1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken
        }
    } catch (err) {
        return {
            ...token,
            error: "Error while getting the new token",
        }
    }
}*/

export async function refreshAccessToken(token: any, refreshToken: any) {
    const authOptions = {
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
        },
        data: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        })
    }

    try {
        const response = await axios(authOptions);

        return {
            ...token,
            accessToken: response.data.access_token,
            accessTokenExpires: Date.now() + 60*1000,
            refreshToken: response.data.refresh_token ?? token.refreshToken
        };
    } catch (err) {
        return token;
    }
}