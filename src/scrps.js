
var master = {
	run: function()
	{
		/*
			The MASTER must control 'meta' elements,
			as in, elements about the AI itself

			Memory needs to be wiped/re-initialized
				- does it ALL need to be?
					- creeps, probably not - just update important things
					- rooms?
						- if terrain is mapped twice, then no?
						- can map as 'physical' ie (floor, wall, resource),
							and temporary (creep, dropped energy, structures)
						- would have to rescan for temp updates, so almost no point
							in keeping 2 separate maps
		*/
	}
};

module.exports = master;

var gameController = {
	run: function()
	{
		/*
			The GAME_CONTROLLER must control elements relevant to 
			the entire game

			Potentially connecting events/elements above the singular room level

			Calls the ROOM_CONTROLLER for each room in Game.rooms


		*/
	}
};

module.exports = gameController;

/******************************************************************************************************/

var roomController = {
	run: function(room)
	{
		/*
			The ROOM_CONTROLLER must control elements relevant to the room

			- Scanning rooms and mapping all elements (terrain, resources, structures, creeps)
			- Processing the terrain to
				- Determine available space around resources
				- Identify entrances to other rooms
				- locate/organize specific structures (spawn, storage, controllers, ...)

			- Once processed, information should be used to
				- Determine if room is safe or not
					- If safe, can move to finding jobs
					- If not, must react to threats
						- Change room 'danger' level
						- assign 'jobs' to attack/defend room?
				- Identify available 'jobs' for creeps
					- harvesting, transporting
					- repairs, healing
					- building, upgrading


		*/
	}
};

module.exports = roomController;

/******************************************************************************************************/

var creepController = {
	run: function(creep, room)
	{
		/*
			The CREEP_CONTROLLER must control each creep's actions each turn

			- Consult room danger level to see if they need to leave
			- Check with memory to determine if they were doing something
				- cross reference with job list to determine if job is still valid
			- If they are free, attempt to find a job to do
				- Will request a job from the JOB_MANAGER
		*/
	}
};

module.exports = creepController;

/******************************************************************************************************/

var jobManager = {
	run: function(room)
	{
		/*
			The JOB_MANAGER must take inputs from rooms and determine the available jobs

			- Receive the room object access the memory and processed terrain map
			- Check which creeps have already claimed a job
				- Mining and any other persistant jobs
				- If such jobs are found, toggle flag on creep to let it know it is approved
					- When creeps are searching for jobs, they will continue with any 'approved' job


		*/
	}
};

module.exports = jobManager;

/******************************************************************************************************/

var mapManager = {
	run: function(room)
	{
		/*
			Perhaps not required, the MAP_MANAGER would take the room as the input, and 
			create/process the terrain array, and store the results into the room's memory.
			This could be placed inside of the ROOM_CONTROLLER as a separate function.

			May be a better idea to not separate it if it will require mroe processing power.
			If not, it could allow for it to be accessed from another class in a less-clunky way
		*/
	}