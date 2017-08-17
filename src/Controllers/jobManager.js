

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
			'workers': []	// current # and IDs of creeps assigned
		};
		return job;
	},

	scanJobs: function(room)
	{
		// Takes the room as input and scans for new jobs
		this.scanGeneralJobs(room);
		this.scanStationaryJob(room);
	},

	scanGeneralJobs: function(room){
			// General Jobs include supplying the: spawn, extensions, towers, controller, storage

			var structures = room.find(FIND_STRUCTURES, { 
					filter: (s) => 
					{
						return  (s.structureType == STRUCTURE_EXTENSION ||
								 s.structureType == STRUCTURE_SPAWN     ||
								 s.structureType == STRUCTURE_TOWER);
					}  
				});

			for (var x = 0; x < structures.length; x++){

				var struc = structures[x];

				if (struc.energy < struc.energyCapacity && room.memory.jobs.generalJobBoard.supply[struc.id]){
					// Non-full energy, job doesn't currently exist
					var job = this.jobFactory();
					job.id = struc.id;
					job.type = struc.type;
					job.spots = 1;

					room.memory.jobs.generalJobBoard.supply[job.id] = job;
				}
			}
/*
			structures = room.find(
				FIND_MY_STRUCTURES, { filter: (s) => return
			   (s.structureType == STRUCTURE_STORAGE)}
			  );*/



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
				job.workers = sourceArray[i]['miners'];

				// Store the job in memory (post it)
				//	will overwrite the previous posting
				room.memory.jobs.stationaryJobBoard.harvestEnergy[job.id] = job;

			}
		}
	},



	jobExists: function(job)
	{
		// Will take a JOB and determine if it is already registered
		var taken = 0;
		for (var i = 0; i < job.workers.length; i++){
			if (job.workers[i])
				taken++;
		}

		if (job.spots > taken){
			//console.log("Manager found free job");
			return true;
		}
		return false;
	},

	removeJob: function(job)
	{
		// Takes a JOB and will remove it from the list
	},

	claimJob: function(job, creep)
	{
		for (var i = 0; i < job.workers.length; i++){
			if (job.workers[i]){
				job.workers[i] = creep.id;
				break;
			}
		}

		if (job.type == 'mining'){
			var sources = creep.room.memory.environment.energySourcesArray;

			for (i in sources){
				if (sources[i]['id'] == job.id){
					//Found matching mining source
					//console.log("Found available job");
					for (var id in sources[i]['miners']){
						if (sources[i]['miners']['id']){
							sources[i]['miners']['id'] = creep.id;
							creep.memory['target'] = sources[i]['id'];
							break;
						}
					}
				}
			}

		}

	},

	getFreeJobCount: function(room)
	{
		var total = 0;

		for (var jobType in room.memory.jobs){
			//console.log("JobType: "+jobType);
			for (var jobClass in room.memory.jobs[jobType]){
				//console.log("JobClass: "+jobClass);
				for (var j in room.memory.jobs[jobType][jobClass]){
					var job = room.memory.jobs[jobType][jobClass][j];
					if (job && job.id){
						//console.log("Found free job: "+job.id);
						var taken = 0;

						for (var i = 0; i < job.workers; i++){
							if (job.workers[i])
								taken++;
						}


						total += (job.spots - taken);
					}
				}
			}
		}

		return total;
	}


};

module.exports = jobManager;