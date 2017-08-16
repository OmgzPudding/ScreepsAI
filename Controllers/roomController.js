
var constructionController = require('Controllers_constructionController');
var jobManager = require('Controllers_jobManager');

var roomController = {
	go: function(room) 
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
		/************
			ROOM SCANNING IS DONE BEFORE THE ROOM_CONTROLLER IS STARTED
		************/

		constructionController.updateRoadPlanning(room);

		if (Game.time % 300 == 0){
			constructionController.createRoadHeatMap(room);
		}


		jobManager.scanJobs(room);


	},

	/*******************
		SCANNING SECTION

	*******************/

	scanRoom: function(room)
	{
		// These are done only the first time
		this.scanTerrain(room);
		this.scanMinerals(room);
		this.scanEnergy(room);

		// This is done every turn
		this.scanEnemies(room);
	},

	scanTerrain: function(room)
	{
		// Terrain is unchanging... only scan if not there already
		if (room.memory.environment.terrainMapArray.length == 0){

			console.log('Scanning terrain for room '+room.name);

			var terrainArray = new Array(50);

			for (var x = 0; x < 50; x++){
				terrainArray[x] = new Array(50);

				for (var y = 0; y < 50; y++){
					var terrain = Game.map.getTerrainAt(x, y, room.name);

					switch (terrain){
						case 'plain':
							terrainArray[x][y] = 1;
							break;
						case 'swamp':
							terrainArray[x][y] = 2;
							break;
						case 'wall':
							terrainArray[x][y] = 3;
					}
				}
			}

			// Store array in memory for room
			room.memory.environment.terrainMapArray = terrainArray;
		}
	},

	scanMinerals: function(room)
	{
		// Minerals won't need to be updated often
		if (room.memory.environment.mineralsArray.length == 0){

			console.log('Scanning minerals for room '+room.name);

			var mineralArray = [];
			var allMinerals = room.find(FIND_MINERALS);

			for (var x in allMinerals){
				var mineral = allMinerals[x];
				mineralArray.push(mineral);
			}

			// Store Resources in Room memory
			room.memory.environment.mineralsArray = mineralArray;
		}
	},

	scanEnergy: function(room)
	{
		// Get the basic Energy Source info initially. It can be updated later much more easily
		if (Object.keys(room.memory.environment.energySourcesArray).length == 0){

			console.log('Scanning energy for room '+room.name);

			var energyArray = [];
			var allEnergy = room.find(FIND_SOURCES);

			for (var i in allEnergy){
				// i only needed to get coordinates
				var posX = allEnergy[i].pos.x;
				var posY = allEnergy[i].pos.y;
				
				var sourceId = allEnergy[i].id;

				var adjacentSpots = 0;


				for (var x = (posX - 1); x <= (posX +1); x++){
					for (var y = (posY - 1); y <= (posY + 1); y++){
						// This will iterate through a 3x3 square around each energy source
						// and count the free spaces which can be used by stationary miners
						if (room.memory.environment.terrainMapArray[x][y] != 3){
							adjacentSpots++;
						}
					}
				}


				var source = {
					'id':  					allEnergy[i].id,
					'x': 					allEnergy[i].pos.x,
					'y': 					allEnergy[i].pos.y,
					'maxEnergy': 			allEnergy[i].energyCapacity,
					'currentEnergy': 		allEnergy[i].energy,
					'adjacentSpots': 		adjacentSpots
				};

				for (var i = 0; i < adjacentSpots; i++){
					source['miner'+(i+1)] = 'none';
				}
				energyArray.push(source);
			}

			room.memory.environment.energySourcesArray = energyArray;

		}
	},

	scanEnemies: function(room)
	{
		var enemies = room.find(FIND_HOSTILE_CREEPS);
		var n = enemies.length;
		var defcon = 5;
		
		if (n >= 10){ // 10+
			defcon = 1;
		}
		else if (n >= 6){ // 6-9
			defcon = 2;
		}
		else if (n >= 3){ // 3-6
			defcon = 3;
		}
		else if (n > 0){ // 1-2
			defcon = 4;
		}

		// Update the room status in memory
		room.memory.DEFCON = defcon;
	},

	/*************************
		END SCANNING SECTION

	*************************/

	lookForCreepAt(x, y, room)
	{
		// Takes coordinates and a room, returns true if a friendly creep is found there
		// returns false if no creep is found

		var creepList = room.find(FIND_MY_CREEPS);
		var found = false;
		for (var c in creepList){
			if ((creepList[c].pos.x == x) && (creepList[c].pos.y == y)){
				found = true;
				break;
			}
		}

		return found;
	},

};

module.exports = roomController;