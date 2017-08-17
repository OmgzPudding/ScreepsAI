

var jobManager = {
	/************************************
		The JOB_MANAGER needs to take rooms as input,
		process their:
			- sources
				- ensure enough miners
				- ensure enough transporters
					- post jobs if not enough current creeps
			- construction
				- 
	************************************/

	jobFactory: function()
	{
		// Generates a blank JOB template
		var job = {
			'id': null,		// id of job will double as id of the target (ie. a energy source id)
			'type': null,	// used to classify job tickets to some extent
			'spots': 0,		// total # of creeps that can be assigned to this
			'workers': 0	// current # of creeps assigned
		};
		return job;
	},

	scanJobs: function(room)
	{
		// Takes the room as input and scans for new jobs
	},

	scanStationaryJob: function(room)
	{
		// Looks for any jobs in the room which can be handled
		// by specialized 'stationary' creeps
		this.scanSourceJobs(room);
	},

	scanSourceJobs: function(room)
	{
		var sourceArray = room.memory.environment.energySourcesArray;

		// First clean up any dead creeps so the position can be re-posted
		for (var i in sourceArray)
		{
			var totalPositions = sourceArray[i]['spots'];
			var freePositions = 0;

			for (var c = 0; c < totalPositions; c++){
				// Loop through each source, and each miner at each source
				var creepId = sourceArray[i]['miners'][c];

				// element isn't null
				if (creepId && !Game.getObjectById(creepId)){
					// Creep no longer exists
					sourceArray[i]['miners'][c] = null;
					freePositions++;
				}
				else if (!creepId){
					freePositions++;
				}

			}

			if (freePositions > 0){
				// Grab new job for posting
				var job = this.jobFactory();

				job.id = sourceArray[i]['id'];
				job.type = "mining";
				job.spots = freePositions;
				job.workers = totalPositions - freePositions;

				// Store the job in memory (post it)
				//	will overwrite the previous posting
				room.memory.jobs.stationaryJobBoard.harvestEnergy[job.id] = job;

			}
		}
	},



	jobExists: function(job)
	{
		// Will take a JOB and determine if it is already registered
	},

	removeJob: function(job)
	{
		// Takes a JOB and will remove it from the list
	}


};

module.exports = jobManager;