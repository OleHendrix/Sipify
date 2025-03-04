import React from 'react';
import SpotifyWebPlayer from 'react-spotify-web-playback';

function Player({ trackUri })
{
    return (
        <SpotifyWebPlayer token={localStorage.getItem('spotifyAccessToken')} uris={[trackUri]}/>
    )
}

export default Player