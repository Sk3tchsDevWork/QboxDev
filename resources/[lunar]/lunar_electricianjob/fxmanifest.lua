-- Resource Metadata
fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Lunar Scripts'
description 'Electrician job'
version '1.0.0'

-- What to run
escrow_ignore {
    'config/cl_edit.lua',
    'config/config.lua',
    'config/sv_config.lua'
}

files {
    'locales/*.json'
}

shared_scripts {
    '@ox_lib/init.lua',
    'config/config.lua',
}

client_scripts {
    'framework/client.lua',
    'config/cl_edit.lua',
    'client/*.lua',
} 

server_scripts {
    'framework/server.lua',
    'config/sv_config.lua',
    'server/*.lua',
} 

dependency '/assetpacks'