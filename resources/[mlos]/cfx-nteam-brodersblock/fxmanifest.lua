fx_version "cerulean"
games {"gta5"}
lua54 'yes'

description "NTeam Border"
author "NTeam Development"

version "1.0"

shared_script {
  '@ox_lib/init.lua',
  'shared/sh_*.lua',
}

client_scripts {
    "client/cl_*.lua"
}

server_scripts {
    "server/sv_*.lua"
}

escrow_ignore {
    'shared/sh_*.lua',
}
dependency '/assetpacks'