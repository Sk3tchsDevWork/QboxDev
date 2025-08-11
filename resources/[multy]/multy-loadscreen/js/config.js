const CONFIG = {
    "server": {
        "name": "Eastwood Roleplay",
        "nameLine1": "Eastwood",
        "nameLine2": "Roleplay",
        "description": "Experience immersive roleplay in our community",
        "logo": "../assets/images/logo.png",
        "cfxLink": "", // Optional: Leave empty to use direct server data only
        "socials": {
            "discord": "https://discord.gg/your-discord",
            "instagram": "",
            "youtube": "",
            "twitter": ""
        }
    },
    
    "theme": "blue", // blue, green, purple, orange, red, cyan
    "randomTheme": false,
    "debug": false,
    
    "video": {
        "url": "https://res.cloudinary.com/dn1x4t0yy/video/upload/v1748718230/videoplayback_1_gljbqw.mp4"
    },
    
    "music": {
        "enabled": true,
        "volume": 30,
        "tracks": [
            {
                "name": "The Thrill - Wizz Khalifa",
                "file": "../assets/music/The-Thrill.mp3"
            },
            {
                "name": "Song 2 - Example",
                "file": "../assets/music/song2.mp3"
            }
        ]
    },
    
    "staff": [
        {
            "name": "Blaxe",
            "role": "Owner",
            "avatar": "../assets/images/staff/blaxe.png"
        },
        {
            "name": "Deano",
            "role": "Head Admin",
            "avatar": "../assets/images/staff/deano.png"
        }
    ],
    
    "loadingStages": [
        {
            "message": "Initializing connection...",
            "detail": "Establishing secure connection to server"
        },
        {
            "message": "Loading game assets...",
            "detail": "Downloading required resources"
        },
        {
            "message": "Setting up environment...",
            "detail": "Preparing the game world"
        },
        {
            "message": "Finalizing setup...",
            "detail": "Almost ready to play!"
        }
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}