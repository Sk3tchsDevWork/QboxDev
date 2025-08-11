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

Core.Notify = function(message)
    ESX.ShowNotification(message)
end