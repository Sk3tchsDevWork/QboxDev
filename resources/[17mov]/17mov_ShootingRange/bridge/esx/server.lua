---@diagnostic disable: duplicate-set-field
if GetResourceState('es_extended') ~= 'started' then return end

local ESX

TriggerEvent("__cfx_export_es_extended_getSharedObject", function(getCore)
    ESX = getCore()
end)

Citizen.CreateThread(function()
    Wait(2500)
    if not ESX then
        TriggerEvent("esx:getSharedObject", function(obj)
            ESX = obj
        end)
    end
end)

Core = {}

Core.GetPlayerFromID = function(source)
    return ESX.GetPlayerFromId(source)
end

Core.GetPlayerIdentifier = function(source)
    return Core.GetPlayerFromID(source).identifier
end

Core.GetPlayerName = function(source)
    return Core.GetPlayerFromID(source).getName()
end

Core.IsPlayerAllowed = function(src, permissionLevel)
    return Core.GetPlayerFromID(src).getGroup() == permissionLevel
end

Core.RegisterCommand = function(commandName, description, permission, fc, arguments)
    ESX.RegisterCommand(commandName, permission, function(xPlayer, args)
        if not Core.IsPlayerAllowed(xPlayer.source, Config.CommandsPermissionsLevel) then
            return Core.ShowNotification(xPlayer.source, Locale('no_permission_to_use_command'))
        end
        fc(xPlayer.source, args)
    end, false, {help = description, arguments = arguments})
end

Core.ShowNotification = function(source, message)
    local xPlayer = Core.GetPlayerFromID(source)
    if xPlayer then
        xPlayer.showNotification(message)
    end
end

Core.RemoveAccountMoney = function(source, count, paymentMethod)
    local xPlayer = Core.GetPlayerFromID(source)
    if xPlayer then
        if xPlayer.getAccount(paymentMethod).money < count then
            return false
        end
        xPlayer.removeAccountMoney(paymentMethod, count)
        return true
    end
end

Core.AddSocietyMoney = function(jobName, count)
    local society = exports['esx_society']:GetSociety(jobName)
    if not society then
        return ServerUtils.Error(("Trying to add money to society account: %s, but this society doesn't exist"):format(jobName))
    end
    TriggerEvent('esx_addonaccount:getSharedAccount', society.account, function(account)
        account.addMoney(count)
    end)
end

Core.LicenseExternalCheck = function(src,licenseName, rangeID, mode, timer, speed, points, weapon, body_part)
    return true
end

Core.AddLicense = function(src, licenseName, licenseLabel)
    TriggerEvent('esx_license:checkLicense', src, licenseName, function(hasLicense)
        if hasLicense then return end
        TriggerEvent('esx_license:addLicense', src, licenseName)
        Core.ShowNotification(src, Locale('shooting_range_onlicenseadd', licenseLabel))
    end)
end


RegisterNetEvent('esx:playerLoaded', function(player)
    TriggerClientEvent('17mov_shootingrange:client:initLastScores', player, GetLastScores())
end)





