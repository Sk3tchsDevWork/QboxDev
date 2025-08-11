local frozen = false

RegisterNetEvent('aegis:client:freeze', function(state)
    frozen = state
    local ped = PlayerPedId()
    FreezeEntityPosition(ped, frozen)
    SetEntityInvincible(ped, frozen)
end)

RegisterNetEvent('aegis:client:heal', function()
    local ped = PlayerPedId()
    SetEntityHealth(ped, 200)
    ClearPedBloodDamage(ped)
end)

RegisterNetEvent('aegis:client:revive', function()
    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)
    NetworkResurrectLocalPlayer(coords.x, coords.y, coords.z, GetEntityHeading(ped), true, true, false)
    ClearPedTasksImmediately(ped)
    TriggerEvent('hospital:client:Revive', 100)
end)

RegisterNetEvent('aegis:client:tp', function(x, y, z)
    local ped = PlayerPedId()
    SetEntityCoords(ped, x + 0.0, y + 0.0, z + 0.5, false, false, false, false)
end)
