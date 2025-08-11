local function getIdentifier(src, prefix) for _, id in ipairs(GetPlayerIdentifiers(src)) do if id:find(prefix) == 1 then return id end end return nil end
local function resolveRole(src) local p=Permissions.Policy.principals or {}; local id = getIdentifier(src,'license:') or getIdentifier(src,'discord:') or getIdentifier(src,'steam:'); if id and p[id] then return p[id] end return nil end
local function flatten(roleName, visited) visited=visited or {}; if visited[roleName] then return {} end; visited[roleName]=true; local role=Permissions.Policy.roles[roleName]; if not role then return {} end; local caps={}; for _,c in ipairs(role.capabilities or {}) do caps[c]=true end; for _,parent in ipairs(role.inherits or {}) do for k,_ in pairs(flatten(parent, visited)) do caps[k]=true end end; return caps end
local function hasCap(src, cap) local r=resolveRole(src); if not r then return false end; local c=flatten(r); if c['*'] then return true end; return c[cap]==true end

-- callbacks
RegisterNetEvent('aegis:cb:request', function(name, token, ...)
    local src = source
    if name == 'aegis:getPlayers' then
        local players = Aegis.Capabilities['players.list'](src, {}) or {}
        TriggerClientEvent('aegis:cb', src, token, players)
    elseif name == 'aegis:getApprovals' then
        local list = Aegis.Duo.List()
        TriggerClientEvent('aegis:cb', src, token, list)
    elseif name == 'aegis:getHeatmap' then
        local size = Config.Heatmap.cellSize or 100.0
        local list = {}
        for _, cell in pairs(Aegis.Heatmap.cells) do
            list[#list+1] = { cx=cell.cx, cy=cell.cy, intensity=cell.intensity }
        end
        TriggerClientEvent('aegis:cb', src, token, { cellSize=size, cells=list })
    else
        TriggerClientEvent('aegis:cb', src, token, {})
    end
end)

-- approvals
RegisterNetEvent('aegis:approve', function(data)
    local src = source
    local ok, payload = Aegis.Duo.Approve(src, tostring(data.token or ''))
    if not ok then TriggerClientEvent('ox_lib:notify', src, { description='Approval failed: '..tostring(payload), type='error' }); return end
    local cap = payload.capability; local pay = payload.payload or {}
    if not hasCap(src, cap..'.approve') and not hasCap(src, cap) then TriggerClientEvent('ox_lib:notify', src, { description='No approve permission', type='error' }); return end
    local fn = Aegis.Capabilities[cap]; if not fn then TriggerClientEvent('ox_lib:notify', src, { description='Unknown capability', type='error' }); return end
    local ok2, res = pcall(fn, src, pay)
    if ok2 then Aegis.Audit.Log(src, pay.target, cap, pay, true, pay.reason, nil); TriggerClientEvent('ox_lib:notify', src, { description='Approved + executed', type='success' })
    else Aegis.Audit.Log(src, pay.target, cap, pay, false, res, nil); TriggerClientEvent('ox_lib:notify', src, { description='Execution error', type='error' }) end
end)

local function capEconomy(target) if Aegis.Capabilities['economy.get'] then local ok,res=pcall(Aegis.Capabilities['economy.get'],0,{target=target}); if ok then return res end end return nil end
local function capInventory(target) if Aegis.Capabilities['inventory.view'] then local ok,res=pcall(Aegis.Capabilities['inventory.view'],0,{target=target}); if ok then return res end end return nil end
local function diff(a,b) return { before=a, after=b } end

RegisterNetEvent('aegis:capability', function(payload)
    local src = source
    local capability = tostring(payload.capability or ''); if capability == '' then return end
    local target = payload.target; local params = payload.params or {}

    if Permissions.Policy.duo_control and Permissions.Policy.duo_control[capability] then
        local reqCap = capability .. '.request'
        if not hasCap(src, reqCap) then TriggerClientEvent('ox_lib:notify', src, { description='No permission (request): '..reqCap, type='error' }); return end
        local tkn = Aegis.Duo.Request(src, capability, payload)
        Aegis.Audit.Log(src, target, reqCap, params, true, payload.reason, nil)
        TriggerClientEvent('ox_lib:notify', src, { description=('Approval requested. Token: %s'):format(tkn), type='info' })
        return
    end

    if not hasCap(src, capability) then TriggerClientEvent('ox_lib:notify', src, { description='No permission: '..capability, type='error' }); Aegis.Audit.Log(src, target, capability, params, false, 'no permission'); return end
    local ok, remain = Aegis.Cooldowns.CanUse(src, capability, Permissions.Policy.cooldowns or {})
    if not ok then TriggerClientEvent('ox_lib:notify', src, { description=('Cooldown %ds'):format(remain), type='warning' }); Aegis.Audit.Log(src, target, capability, params, false, 'cooldown'); return end

    local beforeEco, beforeInv = nil, nil
    if capability:find('inventory%.') or capability:find('economy%.') then if target then beforeEco=capEconomy(target); beforeInv=capInventory(target) end end

    local fn = Aegis.Capabilities[capability]; if not fn then TriggerClientEvent('ox_lib:notify', src, { description='Unknown capability', type='error' }); Aegis.Audit.Log(src, target, capability, params, false, 'unknown capability'); return end
    local ok2, result = pcall(fn, src, payload)
    if not ok2 then Aegis.Audit.Log(src, target, capability, params, false, result); TriggerClientEvent('ox_lib:notify', src, { description='Error: '..tostring(result), type='error' }); return end

    local success, err = true, nil
    if type(result) == 'table' then success, err = result[0] or result[1], result[2]
    elseif type(result) == 'boolean' then success = result end

    local afterEco, afterInv, d = nil, nil, nil
    if (capability:find('inventory%.') or capability:find('economy%.')) and target then afterEco=capEconomy(target); afterInv=capInventory(target); d = { economy=diff(beforeEco, afterEco), inventory=diff(beforeInv, afterInv) } end

    if success then TriggerClientEvent('ox_lib:notify', src, { description='OK: '..capability, type='success' }); Aegis.Audit.Log(src, target, capability, params, true, payload.reason, d)
    else TriggerClientEvent('ox_lib:notify', src, { description='Failed: '..(err or 'unknown'), type='error' }); Aegis.Audit.Log(src, target, capability, params, false, err or 'failed', d) end
end)
