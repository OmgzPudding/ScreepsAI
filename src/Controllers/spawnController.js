
var jobManager = require('Controllers_jobManager');
var creepController = require('Controllers_creepController');

var spawnController = {

    spawnCreeps: function(room)
    {
        var spawnLevel = room.controller.level;
        var defcon = room.memory.DEFCON;

        var freeJobs = jobManager.getFreeJobCount(room);
        
        var creeps = room.find(FIND_MY_CREEPS);

        console.log("Controller: "+spawnLevel+", danger: "+defcon+", free jobs: "+freeJobs);

        var spawnName;
        for (var s in Game.spawns){
        	if (Game.spawns[s].room.name == room.name){
        		spawnName = Game.spawns[s].name;
        	}
        }

       
        if (spawnName && freeJobs > creeps){
        	Game.spawns[spawnName].createCreep([WORK, CARRY, MOVE], "creep", {});
        }




    }
};

module.exports = spawnController;