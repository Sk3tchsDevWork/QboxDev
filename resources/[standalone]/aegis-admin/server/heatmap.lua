Aegis = Aegis or {}
Aegis.Heatmap = Aegis.Heatmap or { cells = {} }

local function cellKey(x, y, size)
    local cx = math.floor(x / size)
    local cy = math.floor(y / size)
    return cx .. ':' .. cy, cx, cy
end

CreateThread(function()
    while true do
        Wait((Config.Heatmap.sampleEverySec or 10) * 1000)
        if not Config.Heatmap.enabled then goto continue end
        local size = Config.Heatmap.cellSize or 100.0
        local now = os.time()
        for _, id in ipairs(GetPlayers()) do
            local ped = GetPlayerPed(tonumber(id))
            if DoesEntityExist(ped) then
                local c = GetEntityCoords(ped)
                local k, cx, cy = cellKey(c.x, c.y, size)
                local cell = Aegis.Heatmap.cells[k] or { cx=cx, cy=cy, intensity=0.0, last=now }
                cell.intensity = cell.intensity + 1.0
                cell.last = now
                Aegis.Heatmap.cells[k] = cell
            end
        end
        local decay = Config.Heatmap.decay or 0.95
        local maxAge = Config.Heatmap.maxAgeSec or 1800
        for k, cell in pairs(Aegis.Heatmap.cells) do
            cell.intensity = cell.intensity * decay
            if (now - cell.last) > maxAge or cell.intensity < 0.05 then
                Aegis.Heatmap.cells[k] = nil
            end
        end
        ::continue::
    end
end)
