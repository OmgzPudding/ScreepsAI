
var constructionController = {
	
	/***************************
		The CONSTRUCTION_CONTROLLER must handle the
		requests for construction of different elements
			ie. road, extension, spawn, etc
	***************************/

	updateRoadPlanning: function(room)
	{
		// This will use a 50x50 grid, similar to the terrainMapArray, but
		// will contain and update information about the usage of each tile
		// in the room. If the usage of any given tile is above the specific
		// threshold, it will make a new road there to be constructed

		if (!room.memory.construction.roadPlanner || room.memory.construction.roadPlanner.length == 0){
			// Initialize it
			var planner = new Array(50);

			for (var x = 0; x < 50; x++){
				planner[x] = new Array(50);
				for (var y = 0; y < 50; y++){
					planner[x][y] = {
						'initTime': null, 	// Will record Game.time when first creep steps on tile
						'lastUpdate':null,  // Records Game.time on last time it was updated
						'usage': 0,			// Will contain a running value of usage
						'road': false		// If usage > threshold, road = true, request road construction
					}
				}
			}
		}
		else {
			var planner = room.memory.construction.roadPlanner;
			var creepList = room.find(FIND_MY_CREEPS);

			for (var i in creepList){
				var creep = creepList[i];
				var x = creep.pos.x;
				var y = creep.pos.y;

				if (!planner[x][y]['initTime'] || planner[x][y]['initTime'] == null){
					planner[x][y]['initTime'] = Game.time;
					planner[x][y]['lastUpdate'] = Game.time;
				}

				if ((Game.time - planner[x][y]['lastUpdate']) > 1000){
					// Last update over 1000 ticks ago... nullify data
					planner[x][y]['usage'] = 0;
					planner[x][y]['road'] = false;
				}
				else {
					planner[x][y]['usage']++;
				}
				
				planner[x][y]['lastUpdate'] = Game.time; // Record update time

				var age = Game.time - planner[x][y]['initTime'];
				
				if (age > 100){
					// Only becomes a candidate for road creation 100 ticks after first step on tile
					var roadThreshold = 15; //15% usage
					var usage = ((planner[x][y]['usage'] / age)*100);

					if (usage > roadThreshold){
						this.requestConstruction(x, y, room, STRUCTURE_ROAD);
					}
				}
			}
		}
	},

	createRoadHeatMap: function(room){
		// Attempt to print out a HTML table to the console
		// Using small colored squares as each tile in the room

		var planner = room.memory.construction.roadPlanner;

		var output = "<table style='width:500px; line-height: 5px'>";


		for (var y = 0; y < 50; y++){

			output += "<tr>";

			for (var x = 0; x < 50; x++){
				var tile = planner[x][y];
				output += td(tile.usage);

			}

			output += "<tr/>";
		}

		output += "</table>";

		console.log(output);


		function td(usage){
			
			var color = 'black';

			if (usage > 50){
				color = 'crimson';
			}
			else if (usage > 30){
				color = 'yellow';
			}
			else if (usage > 20){
				color = 'yellowgreen';
			}
			else if (usage > 10){
				color = 'green';
			}
			else if (usage > 5){
				color = 'mediumblue';
			}
			else if (usage >= 1){
				color = 'darkblue';
			}


			return "<td style='background-color:"+color+"; width: 5px; height: 5px'></td>";
		}
	},


	requestConstruction: function(x, y, room, structure)
	{
		// First and foremost, the coordinates must be a valid building location

		var terrain = Game.map.getTerrainAt(x, y, room.name);

		if (terrain != 3){ // coordinates point to either plain or swamp, not wall
			Game.rooms[room.name].createConstructionSite(x, y, structure);
		}
	}


}; // end 'class'

module.exports = constructionController;