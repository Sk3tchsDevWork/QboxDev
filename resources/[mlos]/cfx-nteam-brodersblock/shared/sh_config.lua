Config = {
	Framework = 'ESX', -- (QB,ESX)

	ControlRooms = { -- insert as many as you want
		[1] = { coords = vector4(1705.7788, 1454.9409, 85.4949, 206.1096) },
	},

	-- jobs that can control border
	Jobs = {'police','sheriff'},

	IgnoreJobs = { -- for this jobs wont be charged when they cross border
		'police',
		'sheriff',
		'ambulance'
	},
	-- enable/disable payment
	Dispatch = false, -- If you want to enable dispatch notification set it to true
	Payment = true,
	-- amount of money to pay when going through border with normal speed and when you drive by very fast
	NormalSpeed = 100,
	FastSpeed = 1000,

	Speed = 60, -- speed in KPH or MPH
	KPH = true,

	-- type of control
	LockAll = true,

	-- TRANSLATION
	Translate = {
		BorderControl = 'Border Control',
	}	
}

Dispatch = function()
	-- insert here your custom dispatch event or export
end