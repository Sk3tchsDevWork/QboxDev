-- config/discord.lua
Config = Config or {}
Config.Discord = Config.Discord or {}

-- Set your webhooks here. If nil, that event won't be sent.
Config.Discord.AuditWebhook = nil            -- overrides audit exporter if you want
Config.Discord.TxAdminWebhook = nil          -- restart/announcement piping
Config.Discord.Embeds = {
    color = 0xFFAA00, -- default color for txAdmin notifications
    footer = 'Aegis Admin'
}
