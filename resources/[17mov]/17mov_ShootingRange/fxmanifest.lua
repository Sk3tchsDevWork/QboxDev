fx_version "cerulean"
game "gta5"
lua54 "yes"

author "17Movement"
version "1.0.1"

shared_scripts {
    "Config.lua",
    "locales/locale.lua",
    "locales/locales/*.lua"
}

client_scripts {
    "bridge/**/client.lua",
    "client/main/utils.lua",
    "client/functions.lua",
    "client/devtool/*",
    "client/main/main.lua",
    "client/main/rangesession.lua"
}

server_scripts {
    "@mysql-async/lib/MySQL.lua",
    "bridge/**/server.lua",
    "server/dbcheck.lua",
    "server/utils.lua",
    "server/main.lua"
}

ui_page "web/index.html"
files {
    "ShootingRanges.json",
    "web/**.*",
    "web/**/**.*",
    "web/**/**/**.*"
}

escrow_ignore {
    "Config.lua",
    "bridge/**/*",
    "locales/locales/*.lua",
    "client/functions.lua",
}
dependency '/assetpacks'