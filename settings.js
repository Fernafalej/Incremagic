var settings = {
	autosave : { amount: 30000, autosaving : true, autosaveId :""},
	idle : {timeNeeded: 300000, timePassed: 0, idling: true},
	init: false,
	currentCollection:"puzzles",
	currentGame: "gather",
	version :["&alpha;",0,0,0],
	colors : {
		"green" : "#008000",
		"red" : "#FF0000",
		"blue" : "#0000FF",
		"aqua" : "#00FFFF",
		"purple" : "#800080",
		"yellow" : "#FFFF00",
		"white" : "#FFFFFF",
		"black" : "#000000"
	},
	startColors : {
		"green" : "#008000",
		"red" : "#FF0000",
		"blue" : "#0000FF",
		"aqua" : "#00FFFF",
		"purple" : "#800080",
		"yellow" : "#FFFF00",
		"white" : "#FFFFFF",
		"black" : "#000000"
	},
	time : 0,
}

function referredColor(color){
	return settings.colors[color];
}

