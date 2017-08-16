


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
						'usage': 0,			// Will contain a running value of usage
						'road': false		// If usage > threshold, road = true, request road construction
					}
				}
			}
			room.memory.construction.roadPlanner = planner;

		}
		else {
			
			var planner = room.memory.construction.roadPlanner;

			var creepList = room.find(FIND_MY_CREEPS);

			for (var i in creepList){
				var creep = creepList[i];

				var x = creep.pos.x;
				var y = creep.pos.y;

				if (!planner[x][y]['initTime'] || planner[x][y]['initTime'] == null){
					planner[x][y]['initTime'] = Game.time; // initialize initTime
				}

				planner[x][y]['usage']++; // increment usage

					
					
				if (planner[x][y]['initTime'] || planner[x][y]['initTime'] > 0){ // has been initialized before
					var timePassed = (Game.time - planner[x][y]['initTime']);
					if (timePassed % 100 == 0 && planner[x][y]['usage'] > 0 && planner[x][y]['initTime'] != Game.time){
						planner[x][y]['usage']--; // Decrement every 100 ticks after initializing
					}

						/*********************************************
								THIS MAY REQUIRE TWEAKING
						*********************************************/

						if (planner[x][y]['usage'] > 20 && planner[x][y]['road'] == false){
							planner[x][y]['road'] = true;
							this.requestConstruction(x, y, room, STRUCTURE_ROAD);
							// request road construction here

						}
						else if (planner[x][y]['usage'] < 5 && planner[x][y]['road'] == true){
							planner[x][y]['road'] = false;

							// when assigning jobs, it must check if the road is supposed to be there,
							// or if it is allowed to decay to nothing
						}
					}


			}




			/*
			for (var x = 0; x < planner.length; x++){
				for (var y = 0; y < planner[x].length; y++){

					if (this.lookForCreepAt(x, y, room)){
						// Creep found on this square
						if (!planner[x][y]['initTime'] || planner[x][y]['initTime'] == null){
							planner[x][y]['initTime'] = Game.time; // initialize initTime
						}

						planner[x][y]['usage']++; // increment usage

					}
					
					if (planner[x][y]['initTime'] || planner[x][y]['initTime'] > 0){ // has been initialized before
						var timePassed = (Game.time - planner[x][y]['initTime']);
						if (timePassed % 100 == 0 && planner[x][y]['usage'] > 0 && planner[x][y]['initTime'] != Game.time){
							planner[x][y]['usage']--; // Decrement every 100 ticks after initializing
						}*/

						/*********************************************
								THIS MAY REQUIRE TWEAKING
						*********************************************/
/*
						if (planner[x][y]['usage'] > 20 && planner[x][y]['road'] == false){
							planner[x][y]['road'] = true;
							this.requestConstruction(x, y, room, STRUCTURE_ROAD);
							// request road construction here

						}
						else if (planner[x][y]['usage'] < 5 && planner[x][y]['road'] == true){
							planner[x][y]['road'] = false;

							// when assigning jobs, it must check if the road is supposed to be there,
							// or if it is allowed to decay to nothing
						}
					}
					
				}*/
			
		}
	},

	createRoadHeatMap: function(room){
		// Attempt to print out a HTML table to the console
		// Using small colored squares as each tile in the room

		if (room.memory.construction.roadPlanner || room.memory.construction.roadPlanner.length > 0){
			var planner = room.memory.construction.roadPlanner;

			var output = "<table style='width:500px; line-height: 5px'>";


			for (var y = 0; y < 50; y++){

				output += "<tr>";

				for (var x = 0; x < 50; x++){
					//var tile = planner[x][y];
					output += td(planner[x][y]['usage']);

				}

				output += "<tr/>";
			}

			output += "</table>";

			console.log("Heat map: ");
			console.log(output);


			function td(usage){
				
				var color = 'navy';

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
					color = 'blue';
				}
				else if (usage >= 1){
					color = 'mediumblue';
				}


				return "<td style='background-color:"+color+"; width: 5px; height: 5px'></td>";
			}
		}
	},


	requestConstruction: function(x, y, room, structure)
	{
		// First and foremost, the coordinates must be a valid building location

		var terrain = Game.map.getTerrainAt(x, y, room.name);

		if (terrain != 3){ // coordinates point to either plain or swamp, not wall
			Game.rooms[room.name].createConstructionSite(x, y, structure);
		}
	},
/*
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
	}*/


}; // end 'class'

module.exports = constructionController;