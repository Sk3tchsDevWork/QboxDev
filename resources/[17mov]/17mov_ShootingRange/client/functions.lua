Functions = {
    TargetSystem = "",
    InventorySystem = "",
    StressSystem = ""
}

if GetResourceState("qb-target") ~= "missing" then
    Functions.TargetSystem = "qb-target"
elseif GetResourceState("qtarget") ~= "missing" then
    Functions.TargetSystem = "qtarget"
elseif GetResourceState("ox_target") ~= "missing" then
    Functions.TargetSystem = "qtarget"    -- OX_Target have a backward compability to qtarget
end

if GetResourceState("ox_inventory") ~= "missing" then
    Functions.InventorySystem = "ox_inventory"
elseif GetResourceState("qb-inventory") ~= "missing" then
    Functions.InventorySystem = "qb-inventory" -- OX_Target have a backward compability to qtarget
end


if GetResourceState("esx_status") ~= "missing" then
    Functions.StressSystem = 'esx_status'
elseif GetResourceState("qb-hud") ~= "missing" then
    Functions.StressSystem = 'qb-hud'
end



Functions.BlockInventory = function(state)
    if Functions.InventorySystem == 'ox_inventory' then
        TriggerEvent('ox_inventory:disarm', true)
        exports.ox_inventory:weaponWheel(state)
        LocalPlayer.state.invBusy = state
    elseif Functions.InventorySystem == 'qb-inventory' then
        RemoveAllPedWeapons(PlayerPedId(), true)
        LocalPlayer.state:set('inv_busy', state, true)
    end
end

Functions.AddWeapon = function(selectedWeapon)
    local plyPed = PlayerPedId()
    SetCurrentPedWeapon(plyPed, GetHashKey('WEAPON_UNARMED'), true) --- clear user weapons before adding new weapon
    RemoveAllPedWeapons(plyPed, true)
    GiveWeaponToPed(plyPed, selectedWeapon, 250, false, true)
    local _, maxAmmo = GetMaxAmmo(plyPed, selectedWeapon)
    SetPedAmmo(plyPed, selectedWeapon, maxAmmo)
    SetAmmoInClip(plyPed, selectedWeapon, GetMaxAmmoInClip(plyPed, selectedWeapon, true))

end

Functions.GetBlockInventoryState = function()
    if Functions.InventorySystem == 'ox_inventory' then
        return LocalPlayer.state.invBusy
    elseif Functions.InventorySystem == 'qb-inventory' then
        return LocalPlayer.state.inv_busy
    end
end

Functions.OnRangeEnter = function(RangeIndex) -- on range scope enter
    local rangeData = Config.Locations[RangeIndex]
    local zOFfset = Functions.TargetSystem == "qtarget" and vec3(0,0,0.5) or 0
    Functions.AddBoxTarget({
        name = 'start-shooting-'..RangeIndex,
        coords = rangeData.start_position - (zOFfset),
        options = {
            {
                label = Locale('start_session_target'),
                icon = "fa-solid fa-bullseye",
                action = function()
                    if Functions.CustomCheck() then
                        Utils.ShowNUI('StartMenu', Config.AllowBorrowedWeapons, Config.Locations[RangeIndex].price)
                    end
                end,
            }
        }
    })
    Functions.AddBoxTarget({
        name = 'leaderboard-'..RangeIndex,
        coords = rangeData.leaderboard_position - (zOFfset),
        options = {
            {
                label = Locale('check_leaderboard_target'),
                icon = "fa-solid fa-clipboard-list",
                action = function()
                    Utils.ShowNUI('Leaderboard')
                end,
            }
        }
    })
end

Functions.OnRangeExit = function(RangeIndex) -- on range scope exit
    exports[Functions.TargetSystem]:RemoveZone('start-shooting-'..RangeIndex)
    exports[Functions.TargetSystem]:RemoveZone('leaderboard-'..RangeIndex)
end

Functions.CustomCheck = function(RangeIndex) -- custom check to allow users using Range with given RangeIndex
    return true
end

Functions.GetShotType = function(shoot_coords, target_object) -- function that is calculating hitboxes.
    if Config.HitBoxes[Config.TargetModel] then
        local hit_offset = GetOffsetFromEntityGivenWorldCoords(target_object, shoot_coords.x, shoot_coords.y, shoot_coords.z)
        local isHeadshot = Utils.Math.IsPointInsidePolygon(Config.HitBoxes[Config.TargetModel].max_points, vec2(hit_offset.x, hit_offset.z))
        if isHeadshot then
            return 'max_points'
        end
        local isTorsoShot = Utils.Math.IsPointInsidePolygon(Config.HitBoxes[Config.TargetModel].mid_points, vec2(hit_offset.x, hit_offset.z))
        if isTorsoShot then
            return 'mid_points'
        end
        local isBodyShot = Utils.Math.IsPointInsidePolygon(Config.HitBoxes[Config.TargetModel].lower_points, vec2(hit_offset.x, hit_offset.z))
        if isBodyShot then
            return 'lower_points'
        end
    end
end

Functions.RangeSessionTick = function(randIndex, time_left) --- function that is called every 100 ms when player is using range
end

Functions.AddBoxTarget = function(params)
    exports[Functions.TargetSystem]:AddBoxZone(params.name, params.coords, 1.0, 1.0, {
        name = params.name,
        heading = params.heading or 0.0,
        minZ = params.coords.z - 0.5,
        maxZ = params.coords.z + 0.5,
    }, {
        options = params.options,
        distance = params.distance or 3.0
    })
end

Functions.IsDead = function()
    return GetEntityHealth(PlayerPedId()) == 0
end

Functions.Draw3DText = function(coords, text, noRect, screenOffsets)
    local onScreen, _x, _y = World3dToScreen2d(coords.x, coords.y, coords.z)
    if onScreen then
        SetTextScale(0.32, 0.32)
        SetTextFont(4)
        SetTextProportional(true)
        SetTextColour(255, 255, 255, 255)
        SetTextEntry("STRING")
        SetTextCentre(true)
        AddTextComponentString(text)
        DrawText(_x + (screenOffsets and screenOffsets.x or 0.0), _y + (screenOffsets and screenOffsets.y or 0.0))
        if not noRect then
            local factor = (string.len(text)) / 500
            DrawRect(_x, _y + 0.0125, 0.030 + factor, 0.03, 0, 0, 0, 150)
        end
    end
end

Functions.DrawText2D = function(text, scale_x, scale_y, screen_x, screen_y, alpha)
    local color = 255
    SetTextFont(4)
    SetTextProportional(true)
    SetTextScale(scale_x, scale_y)
    SetTextColour(color,color,color, alpha)
    SetTextDropshadow(10, 0, 0, 0, alpha)
    SetTextEdge(1, 0, 0, 0, alpha)
    SetTextDropShadow()
    SetTextOutline()
    SetTextEntry("STRING")
    SetTextCentre(true)
    AddTextComponentString(text)
    DrawText(screen_x,screen_y)
end

Functions.DrawCountDown = function(time_left, scale_x, scale_y, screen_x, screen_y, alpha) -- functions that draw countdown. Triggered every tick
    Functions.DrawText2D(time_left, scale_x, scale_y, screen_x, screen_y, alpha)
end

Functions.DrawCurrentSesionInfo = function(time_left, shot_targets, score) -- functions that draw session info like time, points, hits etc... . Triggered every tick
    Functions.DrawText2D(Locale('shooting_range_info', time_left, shot_targets, score), 0.5, 0.5, 0.5, 0, 255)
end

local current_stress = nil

if Config.DisableStressGainDuringSession then
    if Functions.StressSystem == 'esx_status' then
        RegisterNetEvent('esx_status:add', function(name, val)
            if not current_stress or not RangeSession:isActive() or name ~= 'stress' then 
                return
            end
            TriggerEvent('esx_status:remove', 'stress', val)
        end)
    elseif Functions.StressSystem == 'qb-hud' then
        RegisterNetEvent('hud:client:UpdateStress', function(newStress)
            if not current_stress or not RangeSession:isActive() then
                return
            end
            if newStress > current_stress then
                TriggerServerEvent('17mov_ShootingRange:server:neutralizeStress', current_stress)
            end
        end)
    end
end



Functions.GetCurrentStressvalue = function()
    if not Config.DisableStressGainDuringSession then return end
    if Functions.StressSystem == 'esx_status' then
        TriggerEvent('esx_status:getStatus', 'stress', function(status)
            current_stress = status?.val
        end)
    elseif Functions.StressSystem == 'qb-hud' then
        current_stress = Core.GetPlayerData().metadata['stress'] or 0
    end
end


