fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Multy LoadingScreen'
description 'Advanced FiveM Loading Screen with Themes, Music, Players and Staff Display'
version '1.0.0'

loadscreen 'html/index.html'
loadscreen_cursor 'yes'
loadscreen_manual_shutdown 'yes'

client_script 'client.lua'

files {
    'html/index.html',
    'css/style.css',
    'js/main.obfuscated.js',
    'js/config.js',
    'assets/images/*',
    'assets/images/staff/*',
    'assets/music/*'
}

escrow_ignore {
    'html/**/*',
    'css/**/*',
    'js/**/*',
    'assets/**/*'
}
dependency '/assetpacks'