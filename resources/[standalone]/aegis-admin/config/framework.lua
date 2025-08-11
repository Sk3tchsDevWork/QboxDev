-- config/framework.lua
Config = Config or {}

-- Framework selection
Config.Framework = 'qb' -- 'qb' or 'qbox'

-- UI open key
Config.OpenKey = 'F2'

-- Spectate settings
Config.Spectate = { hideHud = true, noclipWhileSpectate = true }

-- Heatmap settings
Config.Heatmap = {
    enabled = true,
    sampleEverySec = 10,    -- how often to sample players
    cellSize = 100.0,       -- meters per grid cell
    decay = 0.95,           -- intensity decay per tick (0..1)
    maxAgeSec = 1800        -- drop cells older than this
}

-- txAdmin settings
Config.txAdmin = {
    showCountdown = true,   -- show a persistent countdown widget when scheduled restart is announced
    bannerSeconds = 10      -- how long to keep announcement text in banner if not a countdown
}
