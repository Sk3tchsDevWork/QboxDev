fx_version 'bodacious'
games { 'gta5' }
--Version : 1.0--
--Author : molo modding--

this_is_a_map "yes"
lua54 'yes'

client_scripts {
    'npc.lua',
    'client.lua',
    'donttouch.lua'
}

data_file('DLC_ITYP_REQUEST')('stream/meta/int_club.ytyp')
data_file 'AUDIO_GAMEDATA' 'audio/molo_casino_game.dat'



files {
   'audio/molo_casino_game.dat151.rel'
   }
   
   escrow_ignore {
  'stream/unlocked/*',
  'npc.lua',
  'client.lua'

  
  }

dependency '/assetpacks'
dependency '/assetpacks'