1. Install dependencies:
	ox_lib - https://github.com/overextended/ox_lib/releases,
	ox_target/qtarget/qb-target
	mx_fixwiring (Can be swapped with a minigame of your choice) - https://github.com/mxlolshop/minigameFixWiring

2. Add ensure lunar_electricianjob into server.cfg and make sure it's started after dependencies.

3. Import the job in your database:

INSERT INTO `jobs` (`name`, `label`) VALUES
('electrician', 'Electrician');

INSERT INTO `job_grades` (`job_name`, `grade`, `name`, `label`, `salary`, `skin_male`, `skin_female`) VALUES
('electrician', 0, 'employee', 'Employee', 100, '{}', '{}');

4. Use this in server.cfg to change the locale: setr ox:locale en