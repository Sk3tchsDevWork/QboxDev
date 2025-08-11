1. Install dependencies:
	ox_lib - https://github.com/overextended/ox_lib/releases,
	ox_target/qtarget/qb-target
	mx_fixwiring (Can be swapped with a minigame of your choice) - https://github.com/mxlolshop/minigameFixWiring

2. Add ensure lunar_electricianjob into server.cfg and make sure it's started after dependencies.

3. Add this to qb-core/shared.lua -> QBShared.Jobs:

['electrician'] = {
	label = 'Electrician',
	defaultDuty = true,
	grades = {
		['0'] = {
			name = 'Employee',
			payment = 100
		}
	}
}

4. Use this in server.cfg to change the locale: setr ox:locale en