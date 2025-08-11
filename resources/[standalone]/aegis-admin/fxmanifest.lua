fx_version 'cerulean'
game 'gta5'

name 'aegis-admin'
description 'Aegis Admin (txAdmin countdown + Discord piping + Heatmap)'
author 'You + ChatGPT'
version '0.3.1'

lua54 'yes'

ui_page 'html/ui/index.html'

files {
    'html/ui/index.html',
    'html/ui/index.js',
    'html/ui/styles.css',
}

shared_scripts {
    '@ox_lib/init.lua',
    'config/framework.lua',
    'config/permissions.lua',
    'config/discord.lua'
}

client_scripts {
    'client/nui_bridge.lua',
    'client/main.lua',
    'client/spectate.lua',
    'client/txa_client.lua',
    'client/heatmap_nui.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/security/sign.lua',
    'server/security/cooldowns.lua',
    'server/security/duocontrol.lua',
    'server/audit/logger.lua',
    'server/audit/exporters/discord_webhook.lua',
    'server/adapters/qb.lua',
    'server/adapters/qbox.lua',
    'server/capabilities/players.lua',
    'server/capabilities/inventory.lua',
    'server/capabilities/jobs.lua',
    'server/capabilities/moderation.lua',
    'server/capabilities/economy.lua',
    'server/capabilities/system.lua',
    'server/txadmin_bridge.lua',
    'server/discord_notify.lua',
    'server/heatmap.lua',
    'server/main.lua'
}

dependencies {
    'ox_lib'
}
