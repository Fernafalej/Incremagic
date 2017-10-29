var resources = {
	"greenG" : { amount : 0 , name : "Balanced Green"},//
	"redG" : { amount : 0, name : "Balanced Red"},	//
	"blueG" : { amount : 0, name : "Balanced Blue"}, //Ier
	"aquaG" : { amount : 0, name : "Balanced Aqua"}, //Vhis
	"purpleG" : { amount : 0, name : "Balanced Purple"},//
	"yellowG" : { amount : 0, name : "Balanced Yellow"},//
	"greenR" : { amount : [] , name : "Refined Green"},//
	"redR" : { amount : [], name : "Refined Red"},	//
	"blueR" : { amount : [], name : "Refined Blue"}, //Ier
	"aquaR" : { amount : [], name : "Refined Aqua"}, //Vhis
	"purpleR" : { amount : [], name : "Refined Purple"},//
	"yellowR" : { amount : [], name : "Refined Yellow"}
	
	//TODO better names
};

var upgrades = {
	
}
var settings = {
	autosave : { amount: 30000, autosaving : true, autosaveID :""},
	init: false,
	currentGame: "gather"
};
var distortion = {
	"greenG" : { amount : 0 , name : "Balanced Green"},
	"redG" : { amount : 0, name : "Balanced Red"},
	"blueG" : { amount : 0, name : "Balanced Blue"},
	"aquaG" : { amount : 0, name : "Balanced Aqua"},
	"purpleG" : { amount : 0, name : "Balanced Purple"},
	"yellowG" : { amount : 0, name : "Balanced Yellow"},
	"greenR" : { amount : [] , name : "Refined Green"},//
	"redR" : { amount : [], name : "Refined Red"},	//
	"blueR" : { amount : [], name : "Refined Blue"}, //Ier
	"aquaR" : { amount : [], name : "Refined Aqua"}, //Vhis
	"purpleR" : { amount : [], name : "Refined Purple"},//
	"yellowR" : { amount : [], name : "Refined Yellow"}
};
//Here is the save function. It saves your data into the user local storage.
function save(){
	var save = {
   		gameG: gameG,
		gameR: gameR,
   		resources: resources,
		settings : settings,
		distortion : distortion
    }
    localStorage.setItem("save",JSON.stringify(save));
}
function load(){
	var savegame = JSON.parse(localStorage.getItem("save"));
	if (savegame != undefined|| null){
		if (savegame.gameG !== undefined || null) gameG = savegame.gameG;
		if (savegame.gameR !== undefined || null) gameR = savegame.gameR;
		if (savegame.resources !== undefined || null) resources = savegame.resources;
		if (savegame.settings !== undefined || null) settings = savegame.settings;
		if (savegame.distortion !== undefined || null) distortion = savegame.distortion;
		changeGame(settings.currentGame);
		loadGameG();
		loadGameR();
	}	
}
function deleteSave(){
	if(confirm('Do you really want to reset?')) {
		localStorage.removeItem('save');
		location.reload();
	}
	//This will delete the save item from the localStorage, at the same time reload the page.
}
function buildTable(tableId, rows, cols){
	deconstructTable(tableId);
	for(var i = 0; i < rows; i++){
		var r = document.getElementById(tableId).insertRow(i);
		for(var j = 0; j < cols; j++){
			r.insertCell(j);
		}
	}
}
function deconstructTable(tableId){
	if(document.getElementById(tableId) == null){
		return false;
	}
	var t = document.getElementById(tableId);
	var x = document.getElementById(tableId).rows.length;
	for(var i = 0; i < x; i++){
		t.deleteRow(0);
	}
	return x;
}
function changeGame(g){
	var x = document.getElementsByClassName("game");
	var y = document.getElementsByClassName("items");
	for(var i = 0; i < x.length; i++){
		x[i].style.display = "none";
	}
	for(var i = 0; i < y.length; i++){
		y[i].style.display = "none";
	}
	document.getElementById(g).style.display = "inline";
	settings.currentGame = g;
	g += "Items";
	document.getElementById(g).style.display = "inline";
}
function startGame(){
	changeGame("gather");
	load();
	if(settings.init == false){
		newGameG();
		newGameR();
		//newGameB();
		settings.init = true;
	}
	updateResources();
	settings.autosave.autosaveID = setInterval(function(){
		save();
	}, settings.autosave.amount);
}
function updateResources(){
	document.getElementById("resources").innerHTML = "";
	for (var res in resources) {
		var obj = resources[res];
		if(obj.amount.constructor === Array){
			for(var i = 0; i < obj.amount.length; i++){
				if(obj.amount[i] != 0){
					document.getElementById("resources").innerHTML += obj.name+ " " + (i+1) + " : "+ obj.amount[i]+ "<br />";
				}
				//TODO low prio roman numerals?
			}
		}
		else if(obj.amount != 0){
			document.getElementById("resources").innerHTML += obj.name + " : "+ obj.amount+ "<br />";
		}
	}
}
function resetDistortion(){
	for(var dis in distortion){
		var obj = distortion[dis];
		obj.amount = 0;
		//TODO array
	}
}
function isObjectInArray(obj, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === obj) {
            return true;
        }
    }

    return false;
}