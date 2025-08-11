Config = {}

-- For webhook configuration, edit server/webhooks.lua
-- Documentation: https://multy.lol/docs/multy-admin

-- Language Configuration
Config.Language = 'en' -- Options: en, zh, es, fr, ar, ru, hi, nl, no

-- Debug mode (shows permission checks in console)
Config.Debug = false

Config.Permissions = {
    -- IMPORTANT: Framework-specific setup requirements:
    -- 
    -- For QB-Core:
    -- 1. Add your custom groups here in 'groups'
    -- 2. ALSO add them to qb-core/config.lua in QBConfig.Server.Permissions
    --    Example: QBConfig.Server.Permissions = {'god', 'admin', 'mod', 'example'}
    -- 3. Then add permissions in server.cfg:
    --    add_principal identifier.discord:123456789 qbcore.example
    --
    -- For Qbox:
    -- 1. Add your custom groups in the 'groups' section below
    -- 2. Define ACE groups in permissions.cfg:
    --    add_ace group.example example allow
    -- 3. Assign players to groups in server.cfg:
    --    add_principal identifier.discord:123456789 group.example
    --
    -- Permission groups configuration (from lowest to highest level)
    -- Define display properties and hierarchy for each group
    groups = {
        ['mod'] = {
            level = 1,
            label = "Moderator", 
            color = "#f39c12",
            description = "Can moderate players and handle basic admin tasks"
        },
        ['admin'] = {
            level = 2,
            label = "Administrator",
            color = "#e74c3c", 
            description = "Full admin access except destructive commands"
        },
        ['god'] = {
            level = 3,
            label = "God/Owner",
            color = "#9b59b6",
            description = "Complete server control"
        },
        -- Example: Custom group
        -- ['example'] = {
        --     level = 1,  -- Same level as mod, but different permissions
        --     label = "Example Group",
        --     color = "#3498db",
        --     description = "Example custom permission group"
        -- }
    },
    
    -- Minimum permission group required to open the admin menu
    minimumGroup = 'mod',
    
    features = {
        -- Player Interaction
        playerInteraction = {
            spectate = 'mod',           -- Watch players
            teleportToPlayer = 'mod',   -- Teleport to a player
            bringPlayer = 'mod',        -- Bring player to you
            returnLastLocation = 'mod', -- Return player to last location
            freeze = 'mod',             -- Freeze/unfreeze player
            heal = 'mod',               -- Heal player  
            kill = 'admin',             -- Kill player
            revive = 'mod',             -- Revive player
            reviveAll = 'admin',        -- Revive all players
        },
        
        -- Player Management
        playerManagement = {
            playerInfo = 'mod',         -- View detailed player information
            viewPlayerIP = 'admin',     -- View player IP addresses in player info
            warn = 'mod',               -- Warn players
            kick = 'mod',               -- Kick from server
            ban = 'admin',              -- Ban from server
            unban = 'admin',            -- Remove bans
            viewBans = 'mod',           -- View ban list
            offlineBan = 'admin',       -- Ban offline players
            openInventory = 'mod',      -- View player inventory
            clearInventory = 'admin',   -- Clear player inventory
            setJob = 'admin',           -- Change player job
            setGang = 'admin',          -- Change player gang
            screenshot = 'admin',       -- Take screenshot of player's screen
            removePlayerCar = 'admin',  -- Remove car from player's garage
            changePed = 'admin',        -- Change player ped model
            resetPed = 'admin',         -- Reset player ped to default
        },
        
        -- Resource Giving
        giveResources = {
            giveItem = 'admin',         -- Give items to players
            giveItemAll = 'god',        -- Give items to all players
            giveMoney = 'admin',        -- Give money to players
            giveMoneyAll = 'god',       -- Give money to all players
            giveCar = 'admin',          -- Give vehicle ownership
            fixPlayerCar = 'mod',       -- Fix player's current vehicle
            giveClothingMenu = 'mod',   -- Give player clothing menu
        },
        
        -- Vehicle Management  
        vehicleOptions = {
            spawnVehicle = 'mod',       -- Spawn vehicles
            deleteVehicle = 'mod',      -- Delete vehicles
            repairVehicle = 'mod',      -- Repair vehicles
            flipVehicle = 'mod',        -- Flip overturned vehicles
            maxTuneVehicle = 'admin',   -- Fully upgrade vehicle
            changePlate = 'admin',      -- Change license plate
        },
        
        -- World Management
        worldManagement = {
            changeWeather = 'admin',    -- Change weather
            changeTime = 'admin',       -- Change time
            freezeTime = 'admin',       -- Stop time progression
            clearArea = 'admin',        -- Clear area of objects
            clearAllVehicles = 'god',   -- Delete ALL vehicles (dangerous!)
        },
        
        -- Server Management
        serverManagement = {
            announcement = 'admin',     -- Server-wide announcements
            refreshJobs = 'god',        -- Reload job data
            refreshItems = 'god',       -- Reload item data
        },
        
        -- Teleportation
        teleportOptions = {
            teleportWaypoint = 'mod',   -- Teleport to waypoint
            teleportCoords = 'admin',   -- Teleport to coordinates
            teleportLocations = 'mod',  -- Teleport to preset locations
        },
        
        -- Developer Tools
        developerTools = {
            noclip = 'mod',             -- Fly through walls
            godmode = 'admin',          -- Invincibility
            invisible = 'admin',        -- Invisibility
            showCoords = 'mod',         -- Display coordinates
            copyCoords = 'mod',         -- Copy coordinates
            entityInfo = 'admin',       -- Entity inspector
            playerBlips = 'admin',      -- Show all players on map
            playerNames = 'admin',      -- Show player names overhead
            infiniteAmmo = 'god',       -- Unlimited ammunition
        },
        
        -- Report System
        reportSystem = {
            viewReports = 'mod',        -- View player reports
            claimReport = 'mod',        -- Claim a report
            closeReport = 'mod',        -- Close completed reports
            deleteReport = 'mod',       -- Delete reports
            respondToReport = 'mod',    -- Send messages in reports
        },
        
        -- Communication
        communication = {
            adminChat = 'mod',          -- Access to admin chat
        }
    }
}

Config.ReportSystem = {
    enabled = true,
    maxReportLength = 500,
    reportTypes = {
        ['player'] = {
            label = 'Player Report',
            icon = 'fas fa-user-shield',
            color = '#e74c3c'
        },
        ['bug'] = {
            label = 'Bug Report',
            icon = 'fas fa-bug',
            color = '#f39c12'
        },
        ['question'] = {
            label = 'Question',
            icon = 'fas fa-question-circle',
            color = '#3498db'
        }
    },
    commands = {
        report = 'report',
        reports = 'reports'
    }
}

Config.InventorySystem = {
    -- Auto-detect inventory system (recommended)
    autoDetect = true,
    
    -- Manual override (set autoDetect to false to use this)
    -- Options: 'qb-inventory', 'ox_inventory', 'ps-inventory'
    manualSystem = 'qb-inventory',
    systems = {
        ['qb-inventory'] = {
            openFunction = function(adminSrc, targetId)
                if exports['qb-inventory'] and exports['qb-inventory'].OpenInventoryById then
                    exports['qb-inventory']:OpenInventoryById(adminSrc, targetId)
                else
                    TriggerEvent("inventory:server:OpenInventory", "otherplayer", adminSrc, targetId)
                end
            end,
            clearFunction = function(targetPlayer)
                if targetPlayer.PlayerData and targetPlayer.PlayerData.items then
                    for slot, _ in pairs(targetPlayer.PlayerData.items) do
                        if targetPlayer.PlayerData.items[slot] then
                            targetPlayer.Functions.RemoveItem(targetPlayer.PlayerData.items[slot].name, targetPlayer.PlayerData.items[slot].amount, slot)
                        end
                    end
                end
                if targetPlayer.Functions.ClearInventory then
                    targetPlayer.Functions.ClearInventory()
                end
            end
        },
        
        ['ox_inventory'] = {
            openFunction = function(adminSrc, targetId)
                if exports.ox_inventory then
                    print("[Multy Admin] Attempting to open ox_inventory for admin " .. adminSrc .. " to target player " .. targetId)
                    TriggerClientEvent('ox_inventory:openInventory', adminSrc, 'player', targetId)
                    print("[Multy Admin] Triggered ox_inventory:openInventory client event")
                    

                    pcall(function()
                        exports.ox_inventory:forceOpenInventory(adminSrc, 'player', targetId)
                        print("[Multy Admin] Called forceOpenInventory")
                    end)
                else
                    print("[Multy Admin] ox_inventory export not available")
                end
            end,
            clearFunction = function(targetPlayer)
                local playerId = targetPlayer.PlayerData.source
                if exports.ox_inventory then
                    exports.ox_inventory:ClearInventory(playerId)
                else
                    local items = exports.ox_inventory:GetInventoryItems(playerId)
                    if items then
                        for slot, item in pairs(items) do
                            exports.ox_inventory:RemoveItem(playerId, item.name, item.count, nil, slot)
                        end
                    end
                end
            end
        },
        
        ['ps-inventory'] = {
            openFunction = function(adminSrc, targetId)
                if exports['ps-inventory'] and exports['ps-inventory'].OpenInventoryById then
                    exports['ps-inventory']:OpenInventoryById(adminSrc, targetId)
                elseif exports['ps-inventory'] and exports['ps-inventory'].OpenInventory then
                    TriggerEvent("inventory:server:OpenInventory", "otherplayer", adminSrc, targetId)
                else
                    TriggerEvent("inventory:server:OpenInventory", "otherplayer", adminSrc, targetId)
                end
            end,
            clearFunction = function(targetPlayer)
                local playerId = targetPlayer.PlayerData.source
                if exports['ps-inventory'] and exports['ps-inventory'].ClearInventory then
                    exports['ps-inventory']:ClearInventory(playerId)
                else
                    if targetPlayer.PlayerData and targetPlayer.PlayerData.items then
                        for slot, _ in pairs(targetPlayer.PlayerData.items) do
                            if targetPlayer.PlayerData.items[slot] then
                                targetPlayer.Functions.RemoveItem(targetPlayer.PlayerData.items[slot].name, targetPlayer.PlayerData.items[slot].amount, slot)
                            end
                        end
                    end
                    if targetPlayer.Functions.ClearInventory then
                        targetPlayer.Functions.ClearInventory()
                    end
                end
            end
        }
    }
}

Config.MenuCommands = {
    openCommand = 'madmin',
    openKey = 'F9'
}

Config.Keybinds = {
    noclip = {
        enabled = true,
        key = 'F2',
        description = 'Toggle Admin Noclip'
    }
}

Config.Features = {
    playerManagement = true,
    vehicleOptions = true,
    weatherTime = true,
    serverManagement = true,
    teleportOptions = true,
    developerOptions = true
}

Config.VehicleSettings = {
    spawnDistance = 3.0,
    platePrefix = 'CAR',
    setFuel = true,
    giveKeys = true,
    putInVehicle = true,
    garages = {
        ['motelgarage'] = {
            label = 'Motel Parking',
            type = 'public',
            category = 'car'
        },
        ['casinogarage'] = {
            label = 'Casino Parking',
            type = 'public',
            category = 'car'
        },
        ['sapcounsel'] = {
            label = 'San Andreas Parking',
            type = 'public',
            category = 'car'
        },
        ['spanishave'] = {
            label = 'Spanish Ave Parking',
            type = 'public',
            category = 'car'
        },
        ['caears24'] = {
            label = 'Caears 24 Parking',
            type = 'public',
            category = 'car'
        },
        ['caears242'] = {
            label = 'Caears 24 Parking',
            type = 'public',
            category = 'car'
        },
        ['lagunapi'] = {
            label = 'Laguna Parking',
            type = 'public',
            category = 'car'
        },
        ['airportp'] = {
            label = 'Airport Parking',
            type = 'public',
            category = 'car'
        },
        ['beachp'] = {
            label = 'Beach Parking',
            type = 'public',
            category = 'car'
        },
        ['themotorhotel'] = {
            label = 'The Motor Hotel Parking',
            type = 'public',
            category = 'car'
        },
        ['liqourparking'] = {
            label = 'Liqour Parking',
            type = 'public',
            category = 'car'
        },
        ['shoreparking'] = {
            label = 'Shore Parking',
            type = 'public',
            category = 'car'
        },
        ['haanparking'] = {
            label = 'Bell Farms Parking',
            type = 'public',
            category = 'car'
        },
        ['dumbogarage'] = {
            label = 'Dumbo Private Parking',
            type = 'public',
            category = 'car'
        },
        ['pillboxgarage'] = {
            label = 'Pillbox Garage Parking',
            type = 'public',
            category = 'car'
        },
        ['grapeseedgarage'] = {
            label = 'Grapeseed Parking',
            type = 'public',
            category = 'car'
        },
        ['depotLot'] = {
            label = 'Depot Lot',
            type = 'depot',
            category = 'car'
        },
        -- Gang garages
        ['ballas'] = {
            label = 'Ballas',
            type = 'gang',
            category = 'car',
            job = 'ballas'
        },
        ['families'] = {
            label = 'Families',
            type = 'gang',
            category = 'car',
            job = 'families'
        },
        ['lostmc'] = {
            label = 'Lost MC',
            type = 'gang',
            category = 'car',
            job = 'lostmc'
        },
        ['cartel'] = {
            label = 'Cartel',
            type = 'gang',
            category = 'car',
            job = 'cartel'
        },
        -- Job garages
        ['police'] = {
            label = 'Police',
            type = 'job',
            category = 'car',
            job = 'police'
        }
    }
}

Config.TeleportLocations = {
    ['police'] = {
        coords = vector3(441.93, -982.29, 30.69),
        label = 'Police Station'
    },
    ['hospital'] = {
        coords = vector3(298.78, -584.66, 43.26),
        label = 'Hospital'
    },
    ['airport'] = {
        coords = vector3(-1037.51, -2963.24, 13.95),
        label = 'Airport'
    },
    ['legion'] = {
        coords = vector3(195.17, -933.77, 30.69),
        label = 'Legion Square'
    },
    ['paleto'] = {
        coords = vector3(-447.24, 6013.46, 31.72),
        label = 'Paleto Bay'
    },
    ['sandy'] = {
        coords = vector3(1863.28, 3673.88, 33.74),
        label = 'Sandy Shores'
    }
}

Config.Noclip = {
    defaultSpeed = 1.0,
    maxSpeed = 16.0,
    controls = {
        speedUp = 15,
        speedDown = 14,
        speedReset = 348,
        fastModifier = 21,
        fasterModifier = 19,
        slowModifier = 36
    }
}

Config.Logging = {
    enabled = true,
    logToConsole = true,
    logActions = {
        teleport = true,
        kick = true,
        ban = true,
        unban = true,
        spawn = true,
        give = true,
        revive = true,
        spectate = true,
        noclip = true,
        godmode = true,
        heal = true,
        freeze = true,
        kill = true,
        setJob = true,
        openInventory = true,
        clearInventory = true,
        deleteVehicle = true,
        repairVehicle = true,
        weather = true,
        time = true,
        announcement = true,
        clearArea = true,
        clearAllVehicles = true,
        refreshJobs = true,
        refreshItems = true,
        screenshot = true,
        adminchat = true,
        fixPlayerCar = true,
        giveClothingMenu = true,
        removeplayercar = true,
        changePed = true,
        resetPed = true
    }
}

Config.Screenshot = {
    enabled = true,
    quality = 85, -- Screenshot quality
    uploadTimeout = 30000, -- 30 seconds timeout
    embedColor = 15158332, -- Red color
    embedTitle = "[MULTY ADMIN] Player Screenshot",
    includeMetadata = true, -- Include player info in embed
    cooldown = 30, -- Cooldown between screenshots
    maxFileSize = 10
}

-- Vehicle Categories and Models
Config.VehicleCategories = {
    ['sports'] = {
        'comet2', 'sultan', 'futo', 'jester', 'elegy2', 'banshee', 'buffalo', 
        'carbonizzare', 'ninef', 'alpha', 'jester2', 'massacro', 'kuruma', 
        'seven70', 'specter', 'streiter', 'neon', 'pariah', 'raiden', 'revolter', 
        'schlagen', 'vstr', 'comet6', 'growler', 'vectre', 'cypher', 'sultan3'
    },
    
    ['super'] = {
        'adder', 'zentorno', 't20', 'turismor', 'osiris', 'entityxf', 'reaper', 
        'italigtb', 'pfister811', 'prototipo', 'tyrus', 'penetrator', 'tempesta', 
        'voltic', 'infernus', 'bullet', 'vacca', 'fmj', 'gp1', 'autarch', 
        'cyclone', 'visione', 'sc1', 'tezeract', 'taipan', 'entity2', 'emerus', 
        'krieger', 'zorrusso', 'tigon', 'furia'
    },
    
    ['sedans'] = {
        'asea', 'emperor', 'fugitive', 'glendale', 'intruder', 'premier', 'primo', 
        'regina', 'schafter2', 'stanier', 'stratum', 'superd', 'surge', 'tailgater', 
        'warrener', 'washington', 'stretch', 'cognoscenti', 'cog55', 'tailgater2', 
        'cinquemila', 'deity', 'jubilee'
    },
    
    ['coupes'] = {
        'cogcabrio', 'exemplar', 'f620', 'felon', 'felon2', 'jackal', 'oracle', 
        'oracle2', 'sentinel', 'sentinel2', 'windsor', 'windsor2', 'zion', 'zion2', 
        'previon', 'champion', 'ignus', 'zeno'
    },
    
    ['suvs'] = {
        'baller', 'baller2', 'bjxl', 'cavalcade', 'cavalcade2', 'dubsta', 'dubsta2', 
        'fq2', 'granger', 'gresley', 'habanero', 'huntley', 'landstalker', 'mesa', 
        'patriot', 'radi', 'rocoto', 'seminole', 'serrano', 'xls', 'baller3', 
        'baller4', 'baller5', 'baller6', 'contender', 'toros', 'novak', 'rebla', 
        'landstalker2', 'seminole2', 'granger2', 'astron', 'baller7', 'jubilee', 
        'patriot3'
    },
    
    ['offroad'] = {
        'bifta', 'blazer', 'blazer3', 'brawler', 'dloader', 'dubsta3', 'dune', 
        'inject', 'marshall', 'mesa3', 'monster', 'rancherxl', 'rebel', 'rebel2', 
        'sandking', 'sandking2', 'technical', 'trophy', 'trophy2', 'blazer4', 
        'caracara', 'kamacho', 'riata', 'freecrawler', 'menacer', 'brutus', 
        'monster3', 'nightshark', 'rcbandito', 'hellion', 'zhaba', 'outlaw', 
        'vagrant', 'everon', 'winky', 'slamtruck', 'squaddie', 'patriot2', 
        'yosemite3', 'draugur'
    },
    
    ['muscle'] = {
        'blade', 'buccaneer', 'chino', 'coquette3', 'dominator', 'dukes', 'gauntlet', 
        'hotknife', 'faction', 'nightshade', 'phoenix', 'picador', 'sabregt', 
        'sabregt2', 'slamvan', 'stalion', 'tampa', 'vigero', 'virgo', 'voodoo', 
        'dukes2', 'stalion2', 'dominator2', 'buffalo2', 'buffalo4', 'impaler', 
        'tulip', 'vamos', 'clique', 'deviant', 'yosemite', 'gauntlet3', 'gauntlet4', 
        'peyote2', 'dominator3', 'manana2', 'glendale2', 'gauntlet5', 'dominator7', 
        'dominator8', 'greenwood', 'buffalo5', 'weevil2'
    },
    
    ['compacts'] = {
        'blista', 'brioso', 'dilettante', 'issi2', 'panto', 'prairie', 'rhapsody', 
        'brioso2', 'weevil', 'club', 'kanjo', 'asbo', 'brioso3'
    },
    
    ['motorcycles'] = {
        'akuma', 'avarus', 'bagger', 'bati', 'bati2', 'bf400', 'carbonrs', 'chimera', 
        'cliffhanger', 'daemon', 'daemon2', 'defiler', 'double', 'enduro', 'esskey', 
        'faggio', 'faggio2', 'faggio3', 'fcr', 'fcr2', 'gargoyle', 'hakuchou', 
        'hakuchou2', 'hexer', 'innovation', 'lectro', 'manchez', 'nemesis', 
        'nightblade', 'oppressor', 'oppressor2', 'pcj', 'ratbike', 'ruffian', 
        'sanchez', 'sanchez2', 'sanctus', 'shotaro', 'sovereign', 'thrust', 'vader', 
        'vindicator', 'vortex', 'wolfsbane', 'zombiea', 'zombieb', 'diablous', 
        'diablous2', 'stryder', 'rrocket', 'deathbike', 'manchez2', 'manchez3', 
        'shinobi', 'reever', 'powersurge'
    },
    
    ['vans'] = {
        'bison', 'bobcatxl', 'boxville', 'burrito', 'burrito3', 'gburrito', 'journey', 
        'minivan', 'moonbeam', 'moonbeam2', 'paradise', 'pony', 'pony2', 'rumpo', 
        'rumpo2', 'rumpo3', 'speedo', 'surfer', 'surfer2', 'taco', 'youga', 'youga2', 
        'youga3', 'speedo4', 'youga4'
    },
    
    ['emergency'] = {
        'ambulance', 'fbi', 'fbi2', 'firetruk', 'lguard', 'pbus', 'police', 'police2', 
        'police3', 'police4', 'policeb', 'polmav', 'policeold1', 'policeold2', 
        'policet', 'pranger', 'predator', 'riot', 'riot2', 'sheriff', 'sheriff2'
    },
    
    ['service'] = {
        'airbus', 'brickade', 'bus', 'coach', 'rallytruck', 'rentalbus', 'taxi', 
        'tourbus', 'trash', 'trash2', 'wastelander'
    },
    
    ['commercial'] = {
        'benson', 'biff', 'hauler', 'hauler2', 'mule', 'mule2', 'mule3', 'mule4', 
        'packer', 'phantom', 'phantom2', 'phantom3', 'pounder', 'pounder2', 
        'stockade', 'stockade3', 'terbyte'
    },
    
    ['military'] = {
        'apc', 'barracks', 'barracks2', 'barracks3', 'barrage', 'chernobog', 
        'crusader', 'halftrack', 'khanjali', 'rhino', 'scarab', 'scarab2', 
        'scarab3', 'thruster', 'trailersmall2', 'vetir', 'minitank', 'patrolboat'
    }
}

-- Ped Categories and Models
Config.PedCategories = {
    ['animals'] = {
        label = 'Animals',
        peds = {
            'a_c_boar', 'a_c_cat_01', 'a_c_chickenhawk', 'a_c_chimp', 'a_c_chop', 
            'a_c_cormorant', 'a_c_cow', 'a_c_coyote', 'a_c_crow', 'a_c_deer', 
            'a_c_dolphin', 'a_c_fish', 'a_c_hen', 'a_c_humpback', 'a_c_husky', 
            'a_c_killerwhale', 'a_c_mtlion', 'a_c_pig', 'a_c_pigeon', 'a_c_poodle', 
            'a_c_pug', 'a_c_rabbit_01', 'a_c_rat', 'a_c_retriever', 'a_c_rhesus', 
            'a_c_rottweiler', 'a_c_seagull', 'a_c_sharkhammer', 'a_c_sharktiger', 
            'a_c_shepherd', 'a_c_stingray', 'a_c_westy'
        }
    },
    
    ['male_civilians'] = {
        label = 'Male Civilians',
        peds = {
            'a_m_y_hipster_01', 'a_m_y_hipster_02', 'a_m_y_hipster_03', 'a_m_y_runner_01', 
            'a_m_y_runner_02', 'a_m_y_skater_01', 'a_m_y_skater_02', 'a_m_y_soucent_01', 
            'a_m_y_soucent_02', 'a_m_y_soucent_03', 'a_m_y_soucent_04', 'a_m_y_stbla_01', 
            'a_m_y_stbla_02', 'a_m_y_stlat_01', 'a_m_y_stlat_02', 'a_m_y_stwhi_01', 
            'a_m_y_stwhi_02', 'a_m_y_sunbathe_01', 'a_m_y_surfer_01', 'a_m_y_vindouche_01', 
            'a_m_y_vinewood_01', 'a_m_y_vinewood_02', 'a_m_y_vinewood_03', 'a_m_y_vinewood_04', 
            'a_m_y_yoga_01', 'a_m_m_afriamer_01', 'a_m_m_beach_01', 'a_m_m_beach_02', 
            'a_m_m_bevhills_01', 'a_m_m_bevhills_02', 'a_m_m_business_01', 'a_m_m_eastsa_01', 
            'a_m_m_eastsa_02', 'a_m_m_farmer_01', 'a_m_m_fatlatin_01', 'a_m_m_genfat_01', 
            'a_m_m_genfat_02', 'a_m_m_golfer_01', 'a_m_m_hasjew_01', 'a_m_m_hillbilly_01', 
            'a_m_m_hillbilly_02', 'a_m_m_indian_01', 'a_m_m_ktown_01', 'a_m_m_malibu_01', 
            'a_m_m_mexcntry_01', 'a_m_m_mexlabor_01', 'a_m_m_og_boss_01', 'a_m_m_paparazzi_01', 
            'a_m_m_polynesian_01', 'a_m_m_prolhost_01', 'a_m_m_rurmeth_01', 'a_m_m_salton_01', 
            'a_m_m_salton_02', 'a_m_m_salton_03', 'a_m_m_salton_04', 'a_m_m_skater_01', 
            'a_m_m_skidrow_01', 'a_m_m_socenlat_01', 'a_m_m_soucent_01', 'a_m_m_soucent_02', 
            'a_m_m_soucent_03', 'a_m_m_soucent_04', 'a_m_m_stlat_02', 'a_m_m_tennis_01', 
            'a_m_m_tourist_01', 'a_m_m_tramp_01', 'a_m_m_trampbeac_01', 'a_m_m_tranvest_01', 
            'a_m_m_tranvest_02'
        }
    },
    
    ['female_civilians'] = {
        label = 'Female Civilians',
        peds = {
            'a_f_y_hipster_01', 'a_f_y_hipster_02', 'a_f_y_hipster_03', 'a_f_y_hipster_04', 
            'a_f_y_runner_01', 'a_f_y_skater_01', 'a_f_y_soucent_01', 'a_f_y_soucent_02', 
            'a_f_y_soucent_03', 'a_f_y_tennis_01', 'a_f_y_topless_01', 'a_f_y_tourist_01', 
            'a_f_y_tourist_02', 'a_f_y_vinewood_01', 'a_f_y_vinewood_02', 'a_f_y_vinewood_03', 
            'a_f_y_vinewood_04', 'a_f_y_yoga_01', 'a_f_m_beach_01', 'a_f_m_bevhills_01', 
            'a_f_m_bevhills_02', 'a_f_m_bodybuild_01', 'a_f_m_business_02', 'a_f_m_downtown_01', 
            'a_f_m_eastsa_01', 'a_f_m_eastsa_02', 'a_f_m_fatbla_01', 'a_f_m_fatcult_01', 
            'a_f_m_fatwhite_01', 'a_f_m_ktown_01', 'a_f_m_ktown_02', 'a_f_m_prolhost_01', 
            'a_f_m_salton_01', 'a_f_m_skidrow_01', 'a_f_m_soucent_01', 'a_f_m_soucent_02', 
            'a_f_m_soucentmc_01', 'a_f_m_tourist_01', 'a_f_m_tramp_01', 'a_f_m_trampbeac_01', 
            'a_f_o_genstreet_01', 'a_f_o_indian_01', 'a_f_o_ktown_01', 'a_f_o_salton_01', 
            'a_f_o_soucent_01', 'a_f_o_soucent_02'
        }
    },
    
    ['emergency'] = {
        label = 'Emergency Services',
        peds = {
            's_m_y_cop_01', 's_f_y_cop_01', 's_m_y_sheriff_01', 's_f_y_sheriff_01', 
            's_m_y_swat_01', 's_m_y_hwaycop_01', 's_m_m_security_01', 's_m_y_fireman_01', 
            's_m_m_paramedic_01', 's_f_m_paramedic_01', 's_m_m_doctor_01', 's_f_m_doctor_01', 
            's_m_m_scientist_01', 's_f_m_scientist_01', 's_m_y_armour_01', 's_m_y_armour_02', 
            's_m_m_armoured_01', 's_m_m_armoured_02', 's_m_y_prisoner_01', 's_m_y_prismuscl_01', 
            's_m_y_blackops_01', 's_m_y_blackops_02', 's_m_y_blackops_03', 's_m_m_ciasec_01', 
            's_m_m_fiboffice_01', 's_m_m_fiboffice_02', 's_m_m_fibsec_01'
        }
    },
    
    ['gangs'] = {
        label = 'Gang Members',
        peds = {
            'g_m_y_ballasog_01', 'g_m_y_ballaeast_01', 'g_m_y_ballaorig_01', 'g_m_y_ballasout_01', 
            'g_m_y_famca_01', 'g_m_y_famdnf_01', 'g_m_y_famfor_01', 'g_m_y_korean_01', 
            'g_m_y_korean_02', 'g_m_y_korlieut_01', 'g_m_y_lost_01', 'g_m_y_lost_02', 
            'g_m_y_lost_03', 'g_m_y_mexgang_01', 'g_m_y_mexgoon_01', 'g_m_y_mexgoon_02', 
            'g_m_y_mexgoon_03', 'g_m_y_pologoon_01', 'g_m_y_pologoon_02', 'g_m_y_salvaboss_01', 
            'g_m_y_salvagoon_01', 'g_m_y_salvagoon_02', 'g_m_y_salvagoon_03', 'g_m_y_strpunk_01', 
            'g_m_y_strpunk_02', 'g_f_y_ballas_01', 'g_f_y_families_01', 'g_f_y_lost_01', 
            'g_f_y_vagos_01'
        }
    },
    
    ['military'] = {
        label = 'Military',
        peds = {
            's_m_y_marine_01', 's_m_y_marine_02', 's_m_y_marine_03', 's_m_m_marine_01', 
            's_m_m_marine_02', 's_m_y_armymech_01', 's_m_y_blackops_01', 's_m_y_blackops_02', 
            's_m_y_blackops_03', 's_m_m_armoured_01', 's_m_m_armoured_02', 'u_m_y_militarybum'
        }
    },
    
    ['workers'] = {
        label = 'Workers',
        peds = {
            's_m_y_airworker', 's_m_y_ammucity_01', 's_m_y_autopsy_01', 's_m_y_barman_01', 
            's_m_y_baywatch_01', 's_m_y_blackops_01', 's_m_y_chef_01', 's_m_y_clown_01', 
            's_m_y_construct_01', 's_m_y_construct_02', 's_m_y_dealer_01', 's_m_y_devinsec_01', 
            's_m_y_dockwork_01', 's_m_y_doorman_01', 's_m_y_dwservice_01', 's_m_y_dwservice_02', 
            's_m_y_garbage', 's_m_y_grip_01', 's_m_y_pestcont_01', 's_m_y_shop_mask', 
            's_m_y_strvend_01', 's_m_y_uscg_01', 's_m_y_valet_01', 's_m_y_waiter_01', 
            's_m_y_winclean_01', 's_m_y_xmech_01', 's_m_y_xmech_02', 's_f_y_airhostess_01', 
            's_f_y_bartender_01', 's_f_y_baywatch_01', 's_f_y_hooker_01', 's_f_y_hooker_02', 
            's_f_y_hooker_03', 's_f_y_migrant_01', 's_f_y_movprem_01', 's_f_y_scrubs_01', 
            's_f_y_shop_low', 's_f_y_shop_mid', 's_f_y_stripperlite', 's_f_y_stripper_01', 
            's_f_y_stripper_02', 's_f_y_sweatshop_01'
        }
    },
    
    ['story_characters'] = {
        label = 'Story Characters',
        peds = {
            'player_zero', 'player_one', 'player_two', 'u_m_y_abner', 'u_m_m_aldinapoli', 
            'u_m_m_bankman', 'u_m_m_bikehire_01', 'u_m_m_blane', 'u_m_m_curtis', 
            'u_m_m_doa_01', 'u_m_m_edtoh', 'u_m_m_fibarchitect', 'u_m_m_filmdirector', 
            'u_m_m_glenstank_01', 'u_m_m_griff_01', 'u_m_m_gunvend_01', 'u_m_m_hippie_01', 
            'u_m_m_jesus_01', 'u_m_m_jewelsec_01', 'u_m_m_jewelthief', 'u_m_m_markfost', 
            'u_m_m_partytarget', 'u_m_m_prolsec_01', 'u_m_m_promourn_01', 'u_m_m_rivalpap', 
            'u_m_m_spyactor', 'u_m_m_willyfist', 'u_m_o_finguru_01', 'u_m_o_taphillbilly', 
            'u_m_o_tramp_01', 'u_m_y_abigail', 'u_m_y_antonb', 'u_m_y_babyd', 'u_m_y_baygor', 
            'u_m_y_burgerdrug_01', 'u_m_y_chip', 'u_m_y_cyclist_01', 'u_m_y_fibmugger_01', 
            'u_m_y_guido_01', 'u_m_y_gunvend_01', 'u_m_y_hippie_01', 'u_m_y_imporage', 
            'u_m_y_justin', 'u_m_y_mani', 'u_m_y_militarybum', 'u_m_y_paparazzi_01', 
            'u_m_y_party_01', 'u_m_y_pogo_01', 'u_m_y_prisoner_01', 'u_m_y_proldriver_01', 
            'u_m_y_rsranger_01', 'u_m_y_sbike', 'u_m_y_staggrm_01', 'u_m_y_tattoo_01', 
            'u_m_y_zombie_01', 'u_f_m_corpse_01', 'u_f_m_miranda', 'u_f_m_promourn_01', 
            'u_f_o_moviestar', 'u_f_o_prolhost_01', 'u_f_y_bikerchic', 'u_f_y_comjane', 
            'u_f_y_corpse_01', 'u_f_y_corpse_02', 'u_f_y_hotposh_01', 'u_f_y_jewelass_01', 
            'u_f_y_mistress', 'u_f_y_poppymich', 'u_f_y_princess', 'u_f_y_spyactress'
        }
    },
    
    ['custom'] = {
        label = 'Custom Peds',
        peds = {
            -- Add custom ped spawn codes here
            -- 'custom_ped_1', 'custom_ped_2', etc.
        }
    }
}