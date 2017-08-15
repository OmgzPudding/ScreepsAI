
var roomController = require('Controllers_roomController');

var gameController = {
	go: function ()
	{
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