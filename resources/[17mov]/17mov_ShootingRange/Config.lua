Config = {}

Config.UseTarget = false -- if you want to use target system
Config.Language = "en"  -- Language setting
Config.Cooldown = {
    enabled = false, -- Enable cooldown for player between sessions
    time = 10 -- Cooldown time in seconds
}
Config.TargetModel = "prop_range_target_01" -- Allowed models: prop_range_target_01 | prop_range_target_02

Config.LeaderboardRestart = { -- Weekly leaderboard restart time
    day = 1, -- [1 - 7 where 1 is Sunday and 7 is Saturday]
    hour = 15, --- [0 - 23]
}

Config.DisableStressGainDuringSession = true -- Disable stress gain during session

Config.CommandsPermissionsLevel = "admin" -- Command permission level
Config.DevtoolsCommand = "shootingrange" -- Name of command that opens devtool

Config.ShowAllRangesInLeaderboard = false -- If you want to show all ranges in leaderboard set to true if only current range set to false
Config.AllowBorrowedWeapons = true -- Enable if you want gun rental
Config.CanStartWithoutWeaponAndAmmo = false -- Enable if you want to allow users to start range session without gun
Config.DisableFiringPlayers = true -- Enable if you want to disable player damage while in range session
Config.TargetDissapearTimeInStaticMode = 6 * 1000 -- Target dissapear time in static mode in miliseconds

Config.TargetSounds = { -- Target sounds (https://gtaforums.com/topic/795622-audio-for-mods)
    activate = 'Target_Activate',
    deactivate = 'Target_Deactivate',
    hit = 'Target_Hit_Body_Red',
    headshot = 'Target_Hit_Head_Black',
    audioRef = 'DLC_GR_Bunker_Shooting_Range_Sounds'
}

Config.MiscSounds = { -- Misc sounds (https://pastebin.com/DCeRiaLJ)
    three_sec_countdown = { sound = '3_2_1', audioRef = 'HUD_MINI_GAME_SOUNDSET' },
    ten_sec_countdown = { sound = 'Bounds_Timer_Pulse', audioRef = 'DLC_SM_VEHWA_Player_Sounds' },
    start = { sound = 'Period_Start', audioRef = 'DLC_AW_BB_Sounds' },
    stop = { sound = 'TIMER_STOP', audioRef = 'HUD_MINI_GAME_SOUNDSET' },
}

Config.Points = { -- Points for each hitbox
    max_points = 100,
    mid_points = 60,
    lower_points = 30,
}

Config.AllowedWeapons = { -- Allowed weapons and translation
    [GetHashKey('WEAPON_PISTOL')] = "Pistol",
    [GetHashKey('WEAPON_COMBATPISTOL')] = "Combat Pistol",
    [GetHashKey('WEAPON_APPISTOL')] = "AP Pistol",
    [GetHashKey('WEAPON_HEAVYPISTOL')] = "Heavy Pistol",
    [GetHashKey('WEAPON_VINTAGEPISTOL')] = "Vintage Pistol",
}

Config.LicensesToAdd = {
    -- {
    --     licenseName = 'weapon', -- license type
    --     licenseLabel = 'Weapon License', -- label to show on notify
    --     minPoints = 400, -- minimum points to get the license
    --     weapons = 'all', -- weapons to add license
    -- },
    -- {
    --     licenseName = 'weapon', -- license type
    --     licenseLabel = 'Weapon License', -- label to show on notify
    --     minPoints = 100, -- minimum points to get the license
    --     weapons = { -- weapons to add license
    --         [GetHashKey('WEAPON_HEAVYPISTOL')] = true
    --     }, 
    -- }
}


-- Spawn delay time function in dynamic mode, if you don't want to use it return 0
Config.SpawnDelayTime = function(multiplayer_points)
    return (1 / 3) * multiplayer_points - 1 / 3
end

Config.PlayModes = { -- Play modes settings and translation
    STATIC = {
        timers = {
            [1] = {
                time = 60 * 1000,
                label = "1 minutes"
            },
            [2] = {
                time = 120 * 1000,
                label = "2 minutes"
            },
            [3] = {
                time = 180 * 1000,
                label = "3 minutes"
            }
        }
    },
    DYNAMIC = {
        timers = {
            [1] = {
                time = 60 * 1000,
                label = "1 minutes"
            },
            [2] = {
                time = 120 * 1000,
                label = "2 minutes"
            },
            [3] = {
                time = 180 * 1000,
                label = "3 minutes"
            }
        },
        speed = {
            [1] = {
                value = 1,
                label = "1x speed"
            },
            [2] = {
                value = 2,
                label = "2x speed"
            },
            [3] = {
                value = 4,
                label = "4x speed"
            },
        }
    }
}

Config.HitBoxes = { -- hitboxes for each taget
    ['prop_range_target_01'] = {
        lower_points = {
            vec2(0.0232902392745, -0.54682350158691),
            vec2(0.05001068115234, -0.55792999267578),
            vec2(0.05238592997193, -0.5646629333496),
            vec2(0.10173723846673, -0.58082771301269),
            vec2(0.11308532953262, -0.6068115234375),
            vec2(0.09637929499149, -0.77116584777832),
            vec2(0.0844689309597, -0.78606414794921),
            vec2(0.08505609631538, -0.81548309326171),
            vec2(0.09220027923583, -0.83001899719238),
            vec2(0.29224509000778, -0.89936065673828),
            vec2(0.31883922219276, -0.93960189819335),
            vec2(0.33066660165786, -0.99579620361328),
            vec2(0.32866382598876, -1.04571342468261),
            vec2(0.31704929471015, -1.17621803283691),
            vec2(0.31893327832221, -1.27197456359863),
            vec2(0.32925641536712, -1.41541862487792),
            vec2(0.31516993045806, -1.60706329345703),
            vec2(0.31413576006889, -1.61403846740722),
            vec2(0.29640933871269, -1.61433982849121),
            vec2(0.30476382374763, -1.65980529785156),
            vec2(0.30127510428428, -1.67560958862304),
            vec2(0.26368862390518, -1.72116470336914),
            vec2(0.21491801738739, -1.73023605346679),
            vec2(-0.20146566629409, -1.73161888122558),
            vec2(-0.26354023814201, -1.69987678527832),
            vec2(-0.28987729549407, -1.66080665588378),
            vec2(-0.28132563829421, -1.60056114196777),
            vec2(-0.30314436554908, -1.59955978393554),
            vec2(-0.31114849448204, -1.33408737182617),
            vec2(-0.30352962017059, -1.16851043701171),
            vec2(-0.31347674131393, -0.974214553833),
            vec2(-0.30839076638221, -0.93448257446289),
            vec2(-0.27207526564598, -0.89489936828613),
            vec2(-0.09079288691282, -0.82704925537109),
            vec2(-0.0916159376502, -0.78722763061523),
            vec2(-0.09970118850469, -0.766695022583),
            vec2(-0.115586951375, -0.64210700988769),
            vec2(-0.10807225853204, -0.59915351867675),
            vec2(-0.09120487421751, -0.57606124877929),
            vec2(-0.0646328702569, -0.56102180480957),
            vec2(-0.03246781602501, -0.54707527160644),
            vec2(-0.00828488823026, -0.54336166381835)
        },
        mid_points = {
            vec2(0.17479678988456, -1.08145523071289),
            vec2(0.14984968304634, -1.02908897399902),
            vec2(0.09608347713947, -0.98513412475585),
            vec2(0.0182927865535, -0.96294593811035),
            vec2(-0.05871541798114, -0.97455978393554),
            vec2(-0.11528098583221, -1.01419830322265),
            vec2(-0.15450251102447, -1.06865882873535),
            vec2(-0.16308088600635, -1.14770126342773),
            vec2(-0.16248187422752, -1.29697036743164),
            vec2(-0.14259859919548, -1.35331153869628),
            vec2(-0.10161098092794, -1.40020561218261),
            vec2(-0.04766683280467, -1.4274559020996),
            vec2(-0.01286113448441, -1.4335708618164),
            vec2(0.06064083054661, -1.42923545837402),
            vec2(0.12993058562278, -1.38933563232421),
            vec2(0.17430183291435, -1.3241901397705),
            vec2(0.18032148480415, -1.20100593566894),
            vec2(0.17932233214378, -1.10275268554687)
        },
        max_points = {
            vec2(0.05620735511183, -1.26156044006347),
            vec2(0.06840445101261, -1.23738670349121),
            vec2(0.06960353255271, -1.18295288085937),
            vec2(0.06527055054903, -1.15090179443359),
            vec2(0.04161670431494, -1.12656211853027),
            vec2(0.01993335783481, -1.11679077148437),
            vec2(-0.00943418312817, -1.11804962158203),
            vec2(-0.03951058536767, -1.13572692871093),
            vec2(-0.05289293453097, -1.16374206542968),
            vec2(-0.05165697261691, -1.23912620544433),
            vec2(-0.03545788675546, -1.26666450500488),
            vec2(-0.00465602334588, -1.28352928161621),
            vec2(0.02741406857967, -1.28160667419433),
            vec2(0.04754599928855, -1.26993179321289)
        }
    },
    ['prop_range_target_02'] = {
        max_points = {
            vec2(0.06649190187454, -0.68417358398437),
            vec2(0.05156657099723, -0.65297317504882),
            vec2(0.02085782587528, -0.62443733215332),
            vec2(-0.02082099951803, -0.6160831451416),
            vec2(-0.06196442991495, -0.63586616516113),
            vec2(-0.08603224158287, -0.67376518249511),
            vec2(-0.09491658210754, -0.72490501403808),
            vec2(-0.08649770915508, -0.77078056335449),
            vec2(-0.05689045414328, -0.8062572479248),
            vec2(-0.01398751698434, -0.8252944946289),
            vec2(0.03485038876533, -0.80745506286621),
            vec2(0.06467522680759, -0.76295280456542),
            vec2(0.07286083698272, -0.71682548522949)
        },
        mid_points = {
            vec2(-0.00703680515289, -0.89497184753417),
            vec2(0.03999443352222, -0.90869140625),
            vec2(0.08444311469793, -0.95490074157714),
            vec2(0.1063162535429, -1.01568794250488),
            vec2(0.10392071306705, -1.08379745483398),
            vec2(0.06942203640937, -1.15058326721191),
            vec2(0.01882739551365, -1.18546104431152),
            vec2(-0.04333477467298, -1.18400764465332),
            vec2(-0.0903246551752, -1.15191650390625),
            vec2(-0.11955035477876, -1.10509490966796),
            vec2(-0.13086156547069, -1.04705238342285),
            vec2(-0.12877383828163, -0.9930076599121),
            vec2(-0.10382225364446, -0.94094657897949),
            vec2(-0.07493018358945, -0.91113662719726),
            vec2(-0.04729909822344, -0.89767265319824)
        },
        lower_points = {
            vec2(-0.00909595377743, -1.24870109558105),
            vec2(0.0463791899383, -1.26133346557617),
            vec2(0.11174519360065, -1.31129455566406),
            vec2(0.15191528201103, -1.39348983764648),
            vec2(0.15864656865596, -1.4662857055664),
            vec2(0.1457499563694, -1.5487937927246),
            vec2(0.08956688642501, -1.63190269470214),
            vec2(0.00481086317449, -1.67084121704101),
            vec2(-0.0669140741229, -1.65766906738281),
            vec2(-0.12836553156375, -1.61350059509277),
            vec2(-0.16667102277278, -1.54568099975585),
            vec2(-0.18164153397083, -1.4716682434082),
            vec2(-0.17624209821224, -1.39934158325195),
            vec2(-0.15005165338516, -1.33140182495117),
            vec2(-0.10517254471778, -1.28232955932617),
            vec2(-0.05901215970516, -1.25516700744628)
        }
    },
}


---@diagnostic disable-next-line: missing-fields
Config.Locations = {} -- Do not touch!!