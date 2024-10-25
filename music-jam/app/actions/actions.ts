"use server";
import axios from "axios";

export async function refreshAccessToken(token: any) {
    const refresh_token = token.refreshToken;
    const authOptions = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
    },
    data: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token
    }).toString()
    };

    axios(authOptions)
    .then(response => {
        if (response.status === 200) {    
            const { access_token, refresh_token, expires_in } = response.data;
            
            token.refreshToken = refresh_token;
            token.accessToken = access_token;
            token.accessTokenExpires = Date.now() + expires_in*1000;

            return token;
        }
    })
    .catch(error => {
        console.error('Error:');
        return {
            ...token, accessTokenExpires: Date.now() + 3600*1000
        }
    });
    return {
        ...token, accessTokenExpires: Date.now() + 3600*1000
    }
}


export async function getAvailableDevices(access_token: string | undefined) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.spotify.com/v1/me/player/devices',
        headers: { 
          'Authorization': `Bearer ${access_token}`
        }
      };
      
      
    try {
        const response = await axios.request(config);
        return JSON.stringify(response.data);
    }
    catch (error) {
        console.log(error);
    }
} 

export async function getCurrentlyPlayingTrack(access_token: string | undefined) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.spotify.com/v1/me/player/currently-playing',
        headers: { 
            'Authorization': `Bearer ${access_token}`
        }
    };


    try {
        const response = await axios.request(config);
        return JSON.stringify(response.data);
    }
    catch (error) {
        console.log(error);
    }
}

// Current logic only supoprt playing of single tracks and not albums or playlists, future improvement ig
export async function startOrResumePlayback({access_token, device_id, song_uri_id}: {access_token: string | undefined, device_id: string, song_uri_id: string}) {
    let data = JSON.stringify({
    "uris": [`spotify:track:${song_uri_id}`],
    "offset": {
        "position": 0
    },
    "position_ms": 0
    });

    let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
    headers: { 
        'Authorization': `Bearer ${access_token}`, 
        'Content-Type': 'application/json'
    },
    data : data
    };

    try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
        return {
            Playing: "True"
        }
    }
    catch (error) {
        console.log(error);
    }
}

export async function pausePlayback({access_token, device_id}: {access_token: string | undefined, device_id: string}) {

    let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`,
        headers: { 
            'Authorization': `Bearer ${access_token}`
        }
    };

    try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
    }
    catch (error) {
        console.log(error);
    }

}

export async function skipToNext({access_token, device_id}: {access_token: string | undefined, device_id: string}) {
    
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://api.spotify.com/v1/me/player/next?device_id=${device_id}`,
        headers: { 
            'Authorization': `Bearer ${access_token}`
        }
    };

    try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
    }
    catch (error) {
        console.log(error);
    }
}

export async function skipToPrevious({access_token, device_id}: {access_token: string | undefined, device_id: string}) {

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://api.spotify.com/v1/me/player/previous?device_id=${device_id}`,
        headers: { 
            'Authorization': `Bearer ${access_token}`
        }
    };

    try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
    }
    catch (error) {
        console.log(error);

    }
}

export async function seekToPosition({access_token, device_id, position_ms}: {access_token: string | undefined, device_id: string, position_ms: string}) {

    let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `https://api.spotify.com/v1/me/player/seek?position_ms=${position_ms}&device_id=${device_id}`,
        headers: { 
            'Authorization': `Bearer ${access_token}`
        }
    };

    try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
    }
    catch (error) {
        console.log(error);
    }

}

export async function setRepeatMode({access_token, device_id, state}: {access_token: string | undefined, device_id: string, state: string}) {
    let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `https://api.spotify.com/v1/me/player/repeat?state=${state}&device_id=${device_id}`,
        headers: { 
            'Authorization': `Bearer ${access_token}`
        }
    };

    try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
    }
    catch (error) {
        console.log(error);
    }
}

export async function setPlaybackVolume({access_token, device_id, volume_percent}: {access_token: string | undefined, device_id: string, volume_percent: string}) {

    let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume_percent}&device_id=${device_id}`,
        headers: { 
            'Authorization': `Bearer ${access_token}`
        }
    };

  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
  }
  catch (error) {
    console.log(error);
  }
}

export async function togglePlaybackShuffl({access_token, device_id, state}: {access_token: string | undefined, device_id: string, state: boolean}) {
    const axios = require('axios');

    let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `https://api.spotify.com/v1/me/player/shuffle?state=${state===true?"true":"false"}&device_id=${device_id}`,
        headers: { 
            'Authorization': `Bearer ${access_token}`
        }
    };

    try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
    }
    catch (error) {
        console.log(error);
    }
}

