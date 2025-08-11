Aegis = Aegis or {}
Aegis.Discord = Aegis.Discord or {}

local function embedPayload(title, description, color)
    return {
        username = 'Aegis Notifications',
        embeds = {{
            title = title,
            description = description,
            color = color or ((Config.Discord.Embeds and Config.Discord.Embeds.color) or 16763904),
            footer = { text = (Config.Discord.Embeds and Config.Discord.Embeds.footer) or 'Aegis Admin' },
            timestamp = os.date('!%Y-%m-%dT%H:%M:%SZ', os.time())
        }}
    }
end

function Aegis.Discord.SendTxA(title, description)
    local url = Config and Config.Discord and Config.Discord.TxAdminWebhook
    if not url then return end
    PerformHttpRequest(url, function() end, 'POST', json.encode(embedPayload(title, description)), { ['Content-Type'] = 'application/json' })
end
