
var roomController = require('Controllers_roomController');

var gameController = {
	go: function ()
	{
		// It may be useful to have all of the terrain/resource data before
		// each room is handled separately
		this.scanAllRooms();

		for (var roomName in Game.rooms){
			var room = Game.rooms[roomName];
			roomController.go(room);
		}
	},

	scanAllRooms: function()
	{
		/****************************
			This function will iterate through each room and gather all
			of the environmental information. This may be needed before 
			the ROOM_CONTROLLER iterates over everything.

		****************************/
		for (var roomName in Game.rooms){
			var room = Game.rooms[roomName];
			roomController.scanRoom(room);
		}
	}
};

module.exports = gameController;