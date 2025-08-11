--This function is ran when player tries to repair the electricity box
function OnRepair()
    local playerPed = PlayerPedId()
    if IsPedInAnyVehicle(playerPed, true) then return end
    TaskStartScenarioInPlace(playerPed, 'PROP_HUMAN_BUM_BIN', 0, true)
    lib.progressCircle({
        label = locale('open'),
        position = 'bottom',
        duration = 5000,
        canCancel = false,
        disable = {
            car = true,
            move = true
        }
    })
    local result = nil
    TriggerEvent('Mx::StartMinigameElectricCircuit', '50%', '50%', '1.0', '30vmin', '1.ogg', function()
        ShowNotification(locale('success_repair'), 'success')
        ClearPedTasks(playerPed)
        RepairFinished()
    end)
end

local savedVehicles = {}

function OnVehicleSpawn(vehicle)
    --Implement your own logic here
end

function OnVehicleSave(vehicle)
    --Implement your own logic here
end

function ShowNotification(message, notifyType)
    lib.notify({
        description = message,
        type = notifyType,
        position = 'top'
    })
end

RegisterNetEvent('lunar_electricianjob:showNotification')
AddEventHandler('lunar_electricianjob:showNotification', ShowNotification)

function ShowUI(text, icon)
    if icon == 0 then
        lib.showTextUI(text)
    else
        lib.showTextUI(text, {
            icon = icon
        })
    end
end

function HideUI()
    lib.hideTextUI()
end