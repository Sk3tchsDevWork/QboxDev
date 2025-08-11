RegisterNUICallback('getMissions', function(_,cb)
    local res = lib.callback.await('av_gangs:getMissions', false)
    dbug("getMissions()", json.encode(res))
    cb(res)
end)

RegisterNUICallback('startMission', function(data,cb)
    if data and not data['started'] then
        if data['isClient'] then
            TriggerEvent(data['event'],data)
        else
            TriggerServerEvent(data['event'], data)
        end
    end
    cb('ok')
end)