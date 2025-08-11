exports('hasDevice', function(name, serial)
    if Config.Inventory and Config.Inventory ~= "ox_inventory" then
        warn("hasDevice() only works if using ox_inventory")
        warn("hasDevice() only works if using ox_inventory")
        warn("hasDevice() only works if using ox_inventory")
        return false
    end
    return lib.callback.await('av_laptop:hasDevice', false, name, serial)
end)

exports("hasItem", function(name, amount)
    return lib.callback.await('av_laptop:getItem', false, name, amount)
end)

exports("removeItem", function(name, amount)
    return lib.callback.await('av_laptop:removeItem', false, name, amount)
end)

exports("getJob", function()
    if not PlayerJob then refreshJob() end
    return PlayerJob
end)

exports('getJobLabel', function()
    if not PlayerJob then refreshJob() end
    if Config.Framework == "qb" then
        return PlayerJob and PlayerJob['label'] or ""
    end
    if Config.Framework == "qbox" then
        return PlayerJob and PlayerJob['label'] or ""
    end
    if Config.Framework == "esx" then
        return PlayerJob and PlayerJob['label'] or ""
    end
    return ""
end)

exports("getGrade", function()
    if not PlayerJob then refreshJob() end
    if Config.Framework == "qb" then
        return PlayerJob['grade']['name']
    end
    if Config.Framework == "qbox" then
        return PlayerJob['grade']['name']
    end
    if Config.Framework == "esx" then
        return PlayerJob['grade_name']
    end
    return ""
end)

exports("getTarget", function()
    return Config.Target
end)

exports("getVehicleProperties", function(vehicle)
    if Config.Framework == "qb" then
        return Core.Functions.GetVehicleProperties(vehicle)
    end
    if Config.Framework == "esx" then
        return Core.Game.GetVehicleProperties(vehicle)
    end
    return lib.getVehicleProperties(vehicle)
end)

exports("setVehicleProperties", function(vehicle, props)
    if Config.Framework == "qb" then
        return Core.Functions.SetVehicleProperties(vehicle, props)
    end
    if Config.Framework == "esx" then
        return Core.Game.SetVehicleProperties(vehicle, props)
    end
    return lib.setVehicleProperties(vehicle, props)
end)

exports("addMetadata", function(field,value)
    if Config.Framework == "esx" then
        TriggerEvent("esx_status:add", field, value * 10000)
    else
        TriggerServerEvent("av_laptop:addMetadata",field,value)
    end
end)

exports("openStash", function(name, label, weight, slots, refresh)
    if Config.Inventory == "ox_inventory" then
        if not refresh then
            local exists = exports.ox_inventory:openInventory('stash', name)
            if not exists then
                local created = lib.callback.await('av_laptop:registerStash', false, name, label, weight, slots)
                if created then
                    exports.ox_inventory:openInventory('stash', name)
                end
            end
        else
            lib.callback.await('av_laptop:registerStash', false, name, label, weight, slots)
            exports.ox_inventory:openInventory('stash', name)
        end
    elseif Config.Inventory == "qb-inventory" and not Config.OldQBInventory then
        TriggerServerEvent("av_laptop:openStash", name, {maxweight = weight, slots = slots, label = label})
    elseif Config.Inventory == "ps-inventory" then
        TriggerServerEvent("av_laptop:openStash", name, {maxweight = weight, slots = slots, label = label})
    elseif Config.Inventory == "codem-inventory" then
        TriggerServerEvent('codem-inventory:server:openstash', name, slots or 50, weight or 100000, label or "Stash")
    elseif Config.Inventory == "qs-inventory" then
        TriggerEvent("inventory:client:SetCurrentStash", name)
        TriggerServerEvent("inventory:server:OpenInventory", "stash", name, {
            maxweight = weight,
            slots = slots,
        }, nil, label)
    elseif Config.Inventory == "tgiann-inventory" then
        exports["tgiann-inventory"]:OpenInventory("stash", name, {maxweight = weight, slots = slots, label = label})
    else
        TriggerEvent("inventory:client:SetCurrentStash", name)
        TriggerServerEvent("inventory:server:OpenInventory", "stash", name, {
            maxweight = weight,
            slots = slots,
        }, label)
    end
end)

exports("hasJob", function(job)
    if not PlayerJob then refreshJob() end
    if type(job) == "string" then
        if PlayerJob and (PlayerJob.name == job or PlayerJob.type == job) then
            return true
        end
    else
        for _, name in pairs(job) do
            if PlayerJob and PlayerJob.name == name or PlayerJob.type == name then
                return true
            end
        end
    end
    return false
end)

exports("setFuel", function(vehicle, amount)
    if not vehicle or not DoesEntityExist(vehicle) then return false end
    local amount = amount or 100
    -- Add your own Set Fuel event/export here:
    -- This example is for ox_fuel
    Entity(vehicle).state.fuel = amount
end)

exports("displayMetadata", function(value, label)
    if Config.Inventory == "ox_inventory" then
        exports.ox_inventory:displayMetadata(value, label)
    end
end)

-- Is Player boss?
exports("isBoss", function()
    if not PlayerJob then refreshJob() end
    if Config.Framework == "qb" then
        return PlayerJob and PlayerJob.isboss or false
    elseif Config.Framework == "qbox" then
        return PlayerJob and PlayerJob.isboss or false 
    elseif Config.Framework == "esx" then
		return PlayerJob and Config.BossGrades[PlayerJob.grade_name] or false
    end
    return false
end)

-- Get player identifier
exports('getIdentifier', function()
    if Config.Framework == "qbox" then
        return QBX.PlayerData and QBX.PlayerData.citizenid or false
    end
    if not PlayerData then getPlayer() end
    if Config.Framework == "qb" then
         return PlayerData and PlayerData.citizenid or false
    end
end)

-- Run laptop as background for your own minigames or whatever
exports("showLaptop", function(tablet, itemCheck)
    local data = false
    SetNuiFocus(true,true)
    if itemCheck then
        data = lib.callback.await("av_laptop:getLaptopData", false)
        if not data then
            SetNuiFocus(false,false)
            return false
        end
    end
    if tablet then
        ToggleTablet(true)
    end
    SendNUIMessage({
        action = "laptopUI",
        data = {
            state = true,
            wallpaper = data or false
        }
    })
    Wait(1000)
    return true
end)

exports("hideLaptop", function()
    SendNUIMessage({
        action = "laptopUI",
        data = {
            state = false
        }
    })
    ToggleTablet(false)
    SetNuiFocus(false,false)
    return true
end)