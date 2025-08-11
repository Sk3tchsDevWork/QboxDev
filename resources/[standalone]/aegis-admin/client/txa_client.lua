-- Client-side UI hooks for txAdmin countdown + announcements
local countdownEnd = 0

RegisterNetEvent('aegis:txadmin:restartScheduled', function(endEpoch, message)
    countdownEnd = endEpoch or 0
    SendNUIMessage({ type = 'txa_countdown', endEpoch = countdownEnd, message = message })
end)

RegisterNetEvent('aegis:txadmin:restartWarning', function(secondsRemaining, message)
    SendNUIMessage({ type = 'txa_warning', seconds = secondsRemaining, message = message })
end)

RegisterNetEvent('aegis:txadmin:announcement', function(message)
    SendNUIMessage({ type = 'txa_announce', message = message })
    TriggerEvent('ox_lib:notify', { description = message or 'Announcement', type = 'inform' })
end)
