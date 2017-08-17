
var gameController = require('Controllers_gameController');

var master = {
	prepare: function()
	{
		/***************
		 Prepare the AI for the next move. This needs to include resetting/overwriting memory
		 Most things will need to be reinitialized every 'turn'

		***************/
		this.wipeMemory();
		this.initializeMemory();
	},

	wipeMemory: function () 
	{
		/***************
		 This will remove all of the existing memory from the last execution. This will ensure nothing
		 than can screw up execution gets left over
		***************/
		for (var creep in Memory.creeps){
			if (Game.creeps[creep]){
				delete Memory.creeps[creep];
			}
		}

		for (var roomName in Game.rooms){
			var room = Game.rooms[roomName];

			if (!room.memory.initialized || room.memory.initalized == false){
				var propertiesArray = Object.getOwnPropertyNames(room.memory);

				for (var x = 0; x < propertiesArray.length; x++){
					delete room.memory[propertiesArray[x]];
				}
				room.memory.initialized = true;				
			}
		}

	},

	initializeMemory: function ()
	{
		/***************
		 Prepare the AI for the next move. This needs to include resetting/overwriting memory
		 Most things will need to be reinitialized every 'turn'

		***************/
		for (let roomName in Game.rooms)
		{
			let room = Game.rooms[roomName];

			if(room)
			{

				if(!room.memory.DEFCON)
				{
					room.memory.DEFCON = 5; // Safe -- will be scanned and updated anyway
				}

				if (!room.memory.environment || !room.memory.environment.energySourcesArray)
				{
					room.memory.environment = {
						terrainMapArray: [],
						energySourcesArray: [],
						mineralsArray: []
					};
				}

				if (!room.memory.construction)
				{
					room.memory.construction = {
						extensionPlacement: {
							RightUp: {x: 0, y: 0},
							RightDown: {x: 0, y: 0},
							LeftUp: {x: 0, y: 0},
							LeftDown: {x: 0, y: 0}
						},
						roadPlanner: []
					};
				}

				if (!room.memory.jobs)
				{
					room.memory.jobs = {
						claimerJobBoard: {
							claimController: {},
							reserveController: {}
						},
						generalJobBoard: {
							supplyExtension: {},
							supplySpawn: {},
							supplyStorage: {},
							supplyTower: {}
						},
						constructionJobBoard: {
							buildStructure: {},
							repairWall: {},
							repairStructure: {}
							
						},
						haulerJobBoard: {
							collectDroppedEnergy: {},
							moveEnergyFromContainer: {}
						},
						stationaryJobBoard: {
							mapArray: [],

							manageStorageAndTerminal: {},
							harvestEnergy: {},
							harvestMineral: {}
						}
					};
					let stationaryJobSitesMapArray = new Array();
					for (let x = 0; x < 50; x++)
					{
						stationaryJobSitesMapArray[x] = new Array();
						for (let y = 0; y < 50; y++)
						{
							stationaryJobSitesMapArray[x][y] = 0;
						}
					}
					room.memory.jobs.stationaryJobBoard.mapArray = stationaryJobSitesMapArray;
				}

				//These need to be scanned each tick... so clear them out every tick
				room.memory.creeps = {
					remoteCreeps: {
						claimerCreepsArray: [],
						remoteBuildStructureCreepsArray: [],
						remoteUpgradeControllerCreepsArray: []
					},
					workerCreeps: {
						smallestWorkerCreepsArray: [],
						smallerWorkerCreepsArray: [],
						smallWorkerCreepsArray: [],
						bigWorkerCreepsArray: [],
						biggerWorkerCreepsArray: [],
						biggestWorkerCreepsArray: []
					},
					haulerCreeps: [],
					stationaryCreeps: []
				};

				room.memory.structures = {
					mapArray: [],

					spawnsArray: [],
					extensionsArray: [],
					extractorsArray: [],
					containersArray: [],
					storageArray: [],
					labsArray: [],
					linksArray: [],
					towersArray: [],
					wallsArray: []
				};

				room.memory.flags = {
					claimController: {},
					remoteBuildStructure: {},
					remoteUpgradeController: {}
				};

				let structuresMapArray = new Array();
				for (let x = 0; x < 50; x++)
				{
					structuresMapArray[x] = new Array();
					for (let y = 0; y < 50; y++)
					{
						structuresMapArray[x][y] = 0;
					}
				}
				room.memory.structures.mapArray = structuresMapArray;
			}
		}
	},

	reinitializeMemory: function()
	{
		for (var roomName in Game.rooms){
			var room = Game.rooms[roomName];
			room.memory.initialized = false;
		}
	},



	execute: function()
	{
		/***************
		 After prep work is done, move on to the GAME_CONTROLLER to continue

		***************/
		gameController.go();
	}
};

module.exports = master;