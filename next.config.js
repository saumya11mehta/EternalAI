/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost','mosaic.scdn.co','i.scdn.co'],
    },
    env : {
        SPOTIFY_CLIENT_ID : process.env.SPOTIFY_CLIENT_ID,
        SPOTIFY_CLIENT_SECRET : process.env.SPOTIFY_CLIENT_SECRET,
        SPOTIFY_REDIRECT_URI : process.env.SPOTIFY_REDIRECT_URI,
        BASE_SPOTIFY_URL : process.env.BASE_SPOTIFY_URL,
    }
}

module.exports = nextConfig
