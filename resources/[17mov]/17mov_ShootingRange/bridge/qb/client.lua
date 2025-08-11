if GetResourceState('qb-core') ~= 'started' then return end

local QBCore

TriggerEvent("__cfx_export_qb-core_GetCoreObject", function(getCore)
    QBCore = getCore()
end)

Core = {}

Core.GetPlayerData = function()
    return QBCore.Functions.GetPlayerData()
end

Core.Notify = function(message)
    QBCore.Functions.Notify(message)
end