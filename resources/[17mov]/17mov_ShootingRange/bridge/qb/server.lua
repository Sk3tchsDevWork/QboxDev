---@diagnostic disable: duplicate-set-field
if GetResourceState('qb-core') ~= 'started' then return end

local QBCore

TriggerEvent("__cfx_export_qb-core_GetCoreObject", function(getCore)
    QBCore = getCore()
end)


Core = {}

Core.GetPlayerFromID = function(source)
    return QBCore.Functions.GetPlayer(source).PlayerData
end

Core.GetPlayerIdentifier = function(source)
    return Core.GetPlayerFromID(source).citizenid
end

Core.GetPlayerName = function(source)
    local player = Core.GetPlayerFromID(source)
    return player?.charinfo.firstname .. " " .. player?.charinfo.lastname
end

Core.IsPlayerAllowed = function(src, permissionLevel)
    return QBCore.Functions.HasPermission(src, permissionLevel)
end

Core.FormatArguments = function(args, givenArgs)
    local returnData = {}
    for i=1, #givenArgs do
        if args[i] then
            returnData[givenArgs[i].name] = args[i]
        end
    end
    return returnData
end

Core.RegisterCommand = function(commandName, description, permission, fc, arguments)
    QBCore.Commands.Add(commandName, description, arguments or {}, arguments and true or false,
    function(source, args)
        fc(source, arguments and Core.FormatArguments(args, arguments) or args)
    end
    , permission)
end

Core.ShowNotification = function(source, message)
    TriggerClientEvent('QBCore:Notify', source, message)
end

Core.RemoveAccountMoney = function(source, count, paymentMethod)
    if paymentMethod == 'money' then
        paymentMethod = 'cash'
    end
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then return false end
    if Player.Functions.GetMoney(paymentMethod) < count then
        return false
    end
    Player.Functions.RemoveMoney(paymentMethod, count)
    return true
end

Core.AddSocietyMoney = function(jobName, count)
    exports['qb-banking']:AddMoney(jobName, count, Locale('shooting_range_payment'))
end

Core.LicenseExternalCheck = function(src,licenseName, rangeID, mode, timer, speed, points, weapon, body_part)
    return true
end

Core.AddLicense = function(src, licenseName, licenseLabel)
    local SearchedPlayer = QBCore.Functions.GetPlayer(src)
    if not SearchedPlayer then return end
    local licenseTable = SearchedPlayer.PlayerData.metadata['licences']
    if licenseTable[licenseName] then return end
    licenseTable[licenseName] = true
    SearchedPlayer.Functions.SetMetaData('licences', licenseTable)
    Core.ShowNotification(src, Locale('shooting_range_onlicenseadd', licenseLabel))
end

RegisterNetEvent("17mov_ShootingRange:server:neutralizeStress", function(value)
    local src = source
    if not IsPlayerInRange(src) then
        return -- exploit, consider adding ban here
    end
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then
        return
    end
    if value > 100 then
        value = 100
    elseif value < 0 then
        value = 0
    end
    Player.Functions.SetMetaData('stress', value)
    TriggerClientEvent('hud:client:UpdateStress', src, value)
end)

RegisterNetEvent('QBCore:Server:OnPlayerLoaded', function()
    local player = source
    TriggerClientEvent('17mov_shootingrange:client:initLastScores', player, GetLastScores())
end)
