Config = {}

Config.Target = 'ox_target' --['ox_target'/'qtarget'/'qb-target']

Config.Freelancer = true --Allows you to work without a job

Config.Employer = {
	Blip = {
		Text = 'Los Santos Water & Power',
		Sprite = 354,
		Size = 1.25,
		Color = 46,
		Display = 2
	},
	Model = `s_m_y_doorman_01`,
	Coords = vector4(677.6003, 74.0690, 83.1188, 266.0516)
}

Config.Vehicle = {
	Model = `burrito`,
	Livery = 3,
	Spawnpoint = vector4(689.3645, 70.4762, 83.7599, 145.0084),
	Save = {
		Coords = vector3(687.2375, 71.5523, 83.6800),
		Radius = 5.0
	},
	SpawnDelay = 10 * 60000, --Player can spawn vehicle every 10 minutes
	Price = 2000 --Price to lend this car
}

Config.Account = 'money'
Config.PricePerMeter = 1.0 --Final reward is based of your distance
Config.PriceRange = 20 --Randomized, example: values based from distance is 450, the resulting range will be 430$-470$
Config.RefreshDuration = 30 * 60000 --New offers every 30 mins
Config.MinDistanceBetweenLocations = 200.0 --Min distance for new offers during work
Config.MinTime = 30 --Min seconds to finish, used to protect against cheater teleporting to waypoint

Config.Locations = {
	{
		Label = 'Motel',
		Description = 'Electricity went out!',
		Icon = 'bed',
		Image = 'https://cdn.discordapp.com/attachments/1085952820462755991/1085954244395409448/image.png',
		Coords = vector3(306.1069, -227.6467, 54.9770)
	},
	{
		Label = 'Traffic lights box',
		Description = 'Wiring is causing problems.',
		Icon = 'traffic-light',
		Image = 'https://cdn.discordapp.com/attachments/1085952820462755991/1085954359197696031/image.png',
		Coords = vector3(423.328430, -295.030609, 50.616062)
	},
	{
		Label = 'Apartment building',
		Description = 'The building is under partial outage.',
		Icon = 'hotel',
		Image = 'https://cdn.discordapp.com/attachments/1085952820462755991/1085954584045944883/image.png',
		Coords = vector3(307.2235, -171.9705, 58.6845)
	},
	{
		Label = 'Richards Majestic Studios',
		Description = 'An electrical box is causing major outage!',
		Icon = 'microphone',
		Image = 'https://cdn.discordapp.com/attachments/1085952820462755991/1085957461514665984/image.png',
		Coords = vector3(-1146.2405, -427.7434, 36.0150)
	},
	{
		Label = 'Eclipse Towers',
		Description = 'Someone has cut the wires!',
		Icon = 'hotel',
		Image = 'https://cdn.discordapp.com/attachments/1085952820462755991/1086568100532596826/image.png',
		Coords = vector3(-743.4931, 313.1834, 84.7902)
	},
	{
		Label = 'Lucky Plucker',
		Description = 'The restaurant is having problems with electricity.',
		Icon = 'utensils',
		Image = 'https://cdn.discordapp.com/attachments/1085952820462755991/1086570313195716678/image.png',
		Coords = vector3(-591.6981, -886.5907, 25.5815)
	},
	{
		Label = 'Casey\'s Diner',
		Description = 'Lights aren\'t working.',
		Icon = 'utensils',
		Image = 'https://cdn.discordapp.com/attachments/1085952820462755991/1086571350388396113/image.png',
		Coords = vector3(794.1213, -726.6635, 27.8636)
	},
	{
		Label = 'Horny\'s Burgers',
		Description = 'Backup generator has collapsed.',
		Icon = 'utensils',
		Image = 'https://cdn.discordapp.com/attachments/1085952820462755991/1086572683338199150/image.png',
		Coords = vector3(1253.603027, -349.980286, 68.921333)
	},
	{
		Label = 'St Fiacre hospital',
		Description = 'The hospital has been suffering with a minor outage.',
		Icon = 'hospital',
		Image = 'https://cdn.discordapp.com/attachments/1085952820462755991/1086573321300230254/image.png',
		Coords = vector3(1114.969116, -1464.970459, 34.757626)
	},
	{
		Label = 'Auto Repairs',
		Description = 'They are suffering from a major outage.',
		Icon = 'wrench',
		Image = 'https://cdn.discordapp.com/attachments/1085952820462755991/1086574304130506822/image.png',
		Coords = vector3(840.886719, -1074.607544, 27.788527)
	},
	{
		Label = 'Small apartment building',
		Description = 'Fuse cabinet is broken.',
		Icon = 'house',
		Image = 'https://cdn.discordapp.com/attachments/1085952820462755991/1086575214449676359/image.png',
		Coords = vector3(-1070.7924, -1043.1647, 2.8479)
	},
	{
		Label = 'Darnell Bros factory',
		Description = 'They are having minor issues with electricity.',
		Icon = 'industry',
		Image = 'https://cdn.discordapp.com/attachments/1085952820462755991/1086576434711113818/image.png',
		Coords = vector3(696.222107, -956.239807, 23.575390)
	},
}