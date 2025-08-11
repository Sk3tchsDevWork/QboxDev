-- txAdmin bridge: restart schedule + announcements -> client UI + Discord
Aegis = Aegis or {}
Aegis.txa = Aegis.txa or { nextRestartEpoch = 0 }

-- Scheduled restart events (txAdmin)
AddEventHandler('txAdmin:events:scheduledRestart', function(data)
    local secs = (data and data.secondsRemaining) or 0
    local msg = (data and data.translatedMessage) or ('Scheduled restart in '..secs..' seconds.')
    local endEpoch = os.time() + secs
    Aegis.txa.nextRestartEpoch = endEpoch

    -- Notify clients
    TriggerClientEvent('aegis:txadmin:restartScheduled', -1, endEpoch, msg)
    TriggerClientEvent('aegis:txadmin:restartWarning', -1, secs, msg)

    -- Discord
    Aegis.Discord.SendTxA('Scheduled Restart', ('%s\nETA: <t:%d:R> (<t:%d:F>)'):format(msg, endEpoch, endEpoch))
end)

-- Announcement pass-through
AddEventHandler('txAdmin:events:announcement', function(data)
    local msg = (data and data.message) or 'Announcement'
    TriggerClientEvent('aegis:txadmin:announcement', -1, msg)
    Aegis.Discord.SendTxA('Announcement', msg)
end)
