
var jobManager = require("Controllers_jobManager");

var creepController = {
	run: function(creep)
	{
		if (creep.memory.target && jobManager.jobExists(creep.memory.target)){
			this.doJob(creep);
		}
		else {
			this.claimJob(creep);
		}
	},

	doJob: function(creep)
	{

	},

	claimJob: function(creep)
	{
		if (creep.type){
			this.findJobOfType(creep, creep.type);
		}
		else {
			// No type, look for a mining job first
			var jobList = creep.room.memory.jobs.stationaryJobBoard.harvestEnergy;

			for (var j in jobList){
				var job = jobList[j];

				if (jobManager.jobExists(job)){
					jobManager.claimJob(job, creep);
				}

			}

		}
	},

	findJobOfType: function(creep, type){

	}
};

module.exports = creepController;