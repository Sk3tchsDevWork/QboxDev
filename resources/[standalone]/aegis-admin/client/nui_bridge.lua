local showing = false

RegisterKeyMapping('aegis_open', 'Open Aegis Admin', 'keyboard', Config.OpenKey)
RegisterCommand('aegis_open', function()
    showing = not showing
    SetNuiFocus(showing, showing)
    SendNUIMessage({ type = showing and 'show' or 'hide' })
end)

RegisterNUICallback('close', function(_, cb)
    showing = false
    SetNuiFocus(false, false)
    cb(true)
end)

RegisterNUICallback('fetchPlayers', function(_, cb)
    TriggerServerCallback('aegis:getPlayers', function(players)
        cb(players)
    end)
end)

RegisterNUICallback('fetchApprovals', function(_, cb)
    TriggerServerCallback('aegis:getApprovals', function(list)
        cb(list)
    end)
end)

RegisterNUICallback('fetchHeatmap', function(_, cb)
    TriggerServerCallback('aegis:getHeatmap', function(data)
        cb(data)
    end)
end)

RegisterNUICallback('doAction', function(data, cb)
    TriggerServerEvent('aegis:capability', data)
    cb(true)
end)

RegisterNUICallback('approveAction', function(data, cb)
    TriggerServerEvent('aegis:approve', data)
    cb(true)
end)

-- promise-based server callback helper
local callbacks = {}
RegisterNetEvent('aegis:cb', function(token, ...)
    if callbacks[token] then callbacks[token](...); callbacks[token] = nil end
end)

function TriggerServerCallback(name, cb, ...)
    local token = tostring(math.random(100000,999999))..tostring(GetGameTimer())
    callbacks[token] = cb
    TriggerServerEvent('aegis:cb:request', name, token, ...)
end
