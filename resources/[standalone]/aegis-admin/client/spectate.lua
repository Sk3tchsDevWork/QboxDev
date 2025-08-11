local spectating = false
local following = false
local targetId = -1
local cam = nil

local function toggleHud(state)
    if Config.Spectate.hideHud then
        DisplayRadar(not state)
    end
end

local function attachCamToEntity(ped)
    local c = CreateCam('DEFAULT_SCRIPTED_CAMERA', true)
    AttachCamToEntity(c, ped, 0.0, 0.0, 1.2, true)
    SetCamActive(c, true)
    RenderScriptCams(true, false, 0, true, true)
    return c
end

local function stopSpectate()
    spectating = false
    following = false
    targetId = -1
    toggleHud(false)
    if cam then
        RenderScriptCams(false, false, 0, true, true)
        DestroyCam(cam, false)
        cam = nil
    end
end

RegisterNetEvent('aegis:client:spectate', function(id, follow)
    local ped = GetPlayerPed(GetPlayerFromServerId(id))
    if not DoesEntityExist(ped) then return end
    targetId = id
    spectating = true
    following = follow or false
    toggleHud(true)
    if cam then DestroyCam(cam, false) end
    cam = attachCamToEntity(ped)
end)

CreateThread(function()
    while true do
        Wait(0)
        if spectating and following and targetId > -1 then
            local ped = GetPlayerPed(GetPlayerFromServerId(targetId))
            if DoesEntityExist(ped) and cam then
                AttachCamToEntity(cam, ped, 0.0, 0.0, 1.2, true)
            end
        end
        if spectating and IsControlJustReleased(0, 177) then -- BACKSPACE
            stopSpectate()
        end
    end
end)

RegisterNetEvent('aegis:client:stopSpectate', function()
    stopSpectate()
end)
