-- READ THE DOCS BEFORE USING THIS SCRIPT: https://docs.av-scripts.com/
-- READ THE DOCS BEFORE USING THIS SCRIPT: https://docs.av-scripts.com/
-- READ THE DOCS BEFORE USING THIS SCRIPT: https://docs.av-scripts.com/

Config = {}
Config.Debug = true
Config.DebugCommand = "debug"          -- Used to enable debug mode in the specified resource (only available for av_laptop resources)
Config.Target = "ox_target"            -- Your target script "ox_target", "qb-target"
Config.AdminLevel = "admin"            -- Min admin level needed to use debug command
Config.LaptopItem = "laptop"           -- The item used to open laptop
Config.HackingDeviceITem = 'decrypter' -- Item used to hack laptops.
Config.UseBattery = true               -- true/false, false will make battery infinite
Config.BatteryTimer = 2                 -- Removes 1% from laptop battery every X minutes while on use
Config.BossGrades = {                  -- This only applies for ESX, many ppl uses different boss grade names (boss, owner, chief, etc) add them here
    ['boss'] = true,
    ['owner'] = true,
}

-- Some default apps config
Config.UseTerminal = true   -- enable system terminal
Config.Documents = true -- enable system files
Config.Calculator = true -- enable calculator
Config.Browser = true -- enable browser
Config.Homepage = "https://av-scripts.tebex.io/" -- default home page

-- Other laptop configs
Config.AllowCustomImages = true -- true/false allow players to use custom backgrounds/avatars using URL
-- Where can I change the default wallpaper/avatar? go to av_laptop/ui/dist and replace wallpaper.jpg / avatar.png
Config.UIlib = "ox_lib" -- Avaiable options "ox_lib" or "lation_ui"

-- Container config, this config is ONLY AVAILABLE WITH OX_INVENTORY
Config.Container = {
    enabled = false, -- Enable Config.LaptopItem as container
    slots = 5, -- slots available in container
    maxWeight = 5, -- max weight for container
    whitelist = { -- list of items allowed in laptop container
        ["black_usb"] = true,
        ["decrypter"] = true,
        ["dongle"] = true,
        ["pendrive"] = true,
        ["vpn"] = true,
    },
}

exports("getFramework", function() -- don't edit/remove this
    return Config.Framework
end)

exports("getInventory", function() -- don't edit/remove this
    return Config.Inventory
end)

exports("getTarget", function() -- don't edit/remove this
    return Config.Target
end)

function dbug(...)
    if Config.Debug then print ('^3[DEBUG]^7', ...) end
end