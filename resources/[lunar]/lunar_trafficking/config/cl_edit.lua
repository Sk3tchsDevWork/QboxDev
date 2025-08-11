---@class MissionData
---@field ped vector4
---@field payout vector4
---@field drug DrugData
---@field vehicle vector4
---@field delivery vector4[]

---@param data MissionData
function ShowMissionNotification(data)
    if Config.MissionNotification == 'normal' then
        lib.notify({
            title = locale('drug_trafficking'),
            description = data.drug.Message,
            position = 'top-right',
            duration = 10000,
            style = {
                width = 330,
                backgroundColor = '#389130',
                color = '#FFFFFF',
                padding = 20,
                ['.description'] = {
                    color = '#FFFFFF'
                }
            },
            icon = 'dollar-sign',
        })
    else
        AddTextEntry('geraldNotification', data.drug.Message .. '\n\n\n') -- Add new lines so it's above the HUD
        BeginTextCommandThefeedPost('geraldNotification')
        EndTextCommandThefeedPostMessagetext('CHAR_MP_GERALD', 'CHAR_MP_GERALD', false, 9, 'Gerald', locale('drug_trafficking'))
        EndTextCommandThefeedPostTicker(false, false)
    end
end

function OnVehicleSpawned(vehicle)
    -- You can add your code here
end