local interactions = {}
local hideUI = false

function setInteractions(data,entry,identifier,gang,interiorType,productType)
    for k, v in pairs(data) do
        local args = {}
        interactions[#interactions+1] = lib.points.new({
            coords = {x = entry['x'] + v['x'], y = entry['y'] + v['y'], z = entry['z'] + v['z']},
            distance = v['dist'],
            label = v['label'],
            identifier = identifier,
            event = v['event'],
            type = v['type'],
            gang = gang,
            productType = productType,
            interiorType = interiorType,
        })
    end
    
end

function addInteraction(data, identifier, gang) -- door is added to interactions after setInteractions
    interactions[#interactions+1] = lib.points.new({
        coords = {x = entry['x'] + data['x'], y = entry['y'] + data['y'], z = entry['z'] + data['z']},
        distance = data['dist'],
        label = data['label'],
        identifier = identifier,
        event = data['event'],
        gang = gang,
    })
    refreshInteractions()
end

function refreshInteractions()
    for k, v in pairs(interactions) do
        function v:nearby()
            if self.currentDistance <= 1.75 then
                if not exports['av_laptop']:isTextUIOpen() and not hideUI then
                    exports['av_laptop']:showTextUI(self.label)
                end
                if IsControlJustReleased(0, 38) then
                    if exports['av_laptop']:isTextUIOpen() then
                        hideUI = true
                        exports['av_laptop']:hideTextUI()
                    end
                    TriggerEvent(self.event, self)
                end
            end
        end
        function v:onExit()
            hideUI = false
            if exports['av_laptop']:isTextUIOpen() then
                exports['av_laptop']:hideTextUI()
            end
        end
    end
end

function wipeInteractions()
    for k, v in pairs(interactions) do
        v:remove()
    end
end