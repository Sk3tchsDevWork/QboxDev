Config = {}
Config.Target = true

-- You can ignore this if you use target.
Config.Keybinds = {
    'E', 'G', 'C'
}

Config.MinPolice = 2 -- Minimum police to start the mission
Config.MaxDuration = 20 * 60000
Config.Delay = 25 * 60000 -- Gerald will offer a mission 15 minutes after max duration.

---@type 'normal' | 'gta'
Config.MissionNotification = 'gta' -- Can be further configured in cl_edit.lua

Config.Ped = {
    Model = `csb_g`,
    ---@type BlipData
    Blip = {
        Name = 'Gerald',
        Sprite = 431,
        Size = 1.20,
        Color = 5
    },
    --- One gets chosen at random
    Locations = {
        vector4(1203.7632, 2716.2466, 38.0041, 273.3827),
        vector4(917.5496, 3654.9229, 32.4840, 1.3602),
        vector4(1857.7456, 3854.7813, 33.1018, 200.3256),
        vector4(2039.5228, 3183.9924, 45.2589, 236.0055)
    }
}

---@class DrugData
---@field Name string
---@field Message string
---@field Reward { min: integer, max: integer }
---@field Account string
---@field Model number | string
---@field Packages vector3[]


---@type DrugData[]
Config.Drugs = {
    {
        Name = 'coke',
        Message = 'Gerald needs help in transporting large amounts of cocaine!',
        Reward = { min = 2000, max = 5000 }, -- Reward per package
        Account = 'money',
        Model = `bkr_prop_coke_block_01a`,
        -- Offsets
        Packages = {
            vector3(0.0, -2.75, 0.4),
            vector3(0.0, -2.0, 0.4),
            vector3(0.0, -1.25, 0.4),
        }
    },
    {
        Name = 'weed',
        Message = 'Gerald needs help in transporting large amounts of weed!',
        Reward = { min = 2000, max = 5000 },
        Account = 'money',
        Model = `bkr_prop_weed_bigbag_01a`,
        Packages = {
            vector3(0.35, -2.75, 0.4),
            vector3(-0.35, -2.75, 0.4),
            vector3(0.35, -2.0, 0.4),
            vector3(-0.35, -2.0, 0.4),
            vector3(0.35, -1.25, 0.4),
            vector3(-0.35, -1.25, 0.4),
        }
    }
}

Config.Vehicle = {
    Model = `sandking`,
    ---@type BlipData
    Blip = {
        Name = 'Stashed Vehicle',
        Sprite = 225,
        Size = 1.0,
        Color = 26
    },
    Locations = {
        vector4(1959.8926, 4648.2573, 40.8100, 251.0497),
        vector4(2548.7625, 4645.7500, 34.0768, 318.0927),
        vector4(1342.1763, 4317.4141, 37.9861, 350.0041),
        vector4(1552.2714, 2194.4280, 78.8780, 4.3738)
    }
}

Config.Delivery = {
    Peds = {
        `s_m_y_dealer_01`,
        `s_m_y_waretech_01`,
        `a_m_m_socenlat_01`,
        `a_m_m_skidrow_01`,
        `a_m_y_genstreet_02`,
        `a_m_y_polynesian_01`,
        `a_m_m_soucent_01`,
        `a_m_m_soucent_02`,
        `a_m_m_soucent_03`,
        `a_m_m_soucent_04`,
        `a_m_m_stlat_02`,
    },
    ---@type BlipData
    Blip = {
        Name = 'Client',
        Sprite = 480,
        Size = 1.0,
        Color = 26
    },
    Locations = {
        vector4(22.7937, 3671.9299, 39.7550, 65.3389),
        vector4(241.4382, 3107.8030, 42.4872, 98.4180),
        vector4(563.3711, 2600.9946, 43.1081, 112.6229),
        vector4(2358.8315, 2518.2134, 46.6677, 319.4512),
        vector4(2522.2517, 4126.0693, 38.6307, 67.6741),
        vector4(1691.2914, 6436.0176, 32.6498, 68.2304),
        vector4(-396.7495, 6076.9580, 31.5001, 319.6364),
        vector4(-109.2318, 2795.3628, 53.3042, 280.3558),
        vector4(61.1869, 2793.3262, 57.8782, 328.2028),
        vector4(-87.3948, 1880.3447, 197.3250, 270.6442),
        vector4(-1130.2305, 2700.0049, 18.8004, 134.2075)
    },
    Dispatch = {
        Enabled = true,
        Code = '10-85',
		Title = 'Drug Trafficking',
		Message = 'A criminal group has started transporting large amount of drugs.',
        VehicleBlip = { --The blip attached to the vehicle
			UpdateInterval = 10000, --Blip update interval in milliseconds, lowering this value will make your server lag.
			Name = 'Drug Transport Vehicle',
			Sprite  = 225,
			Size   = 1.0,
			Color  = 1
		}
    }
}