var resources = {
	"greenG" : { amount : 0 , name : "Green Essence"},//
	"redG" : { amount : 0, name : "Red Essence"},	//
	"blueG" : { amount : 0, name : "Blue Essence"}, //Ier
	"aquaG" : { amount : 0, name : "Aqua Essence"}, //Vhis
	"purpleG" : { amount : 0, name : "Purple Essence"},//
	"yellowG" : { amount : 0, name : "Yellow Essence"},//
	"greenR" : { amount : [5] , name : "Crystallized Green"},//
	"redR" : { amount : [5], name : "Crystallized Red"},	//
	"blueR" : { amount : [5], name : "Crystallized Blue"}, //Ier
	"aquaR" : { amount : [], name : "Crystallized Aqua"}, //Vhis
	"purpleR" : { amount : [], name : "Crystallized Purple"},//
	"yellowR" : { amount : [], name : "Crystallized Yellow"}
	
	//TODO better names
}
var runes = {
	"Hi" : {amount : [5]},
	"Bye" : {amount : [1]}
}
var upgrades = {
	gameR : {
		 
	},
	gameG : {
		 
	},
	gameB : {
		 
	}
}
var items ={
	gameR : {
		 
	},
	gameG : {
		 
	},
	gameB : {
		 
	}
}
var techs = {
	gameR : {
		 
	},
	gameG : {
		 
	},
	gameB : {
		 
	}
}
var settings = {
	autosave : { amount: 30000, autosaving : true, autosaveID :""},
	init: false,
	currentGame: "gather"
};
var distortion = {
	"greenG" : { amount : 0 , name : "Green Essence"},//
	"redG" : { amount : 0, name : "Red Essence"},	//
	"blueG" : { amount : 0, name : "Blue Essence"}, //Ier
	"aquaG" : { amount : 0, name : "Aqua Essence"}, //Vhis
	"purpleG" : { amount : 0, name : "Purple Essence"},//
	"yellowG" : { amount : 0, name : "Yellow Essence"},//
	"greenR" : { amount : [] , name : "Crystallized Green"},//
	"redR" : { amount : [], name : "Crystallized Red"},	//
	"blueR" : { amount : [], name : "Crystallized Blue"}, //Ier
	"aquaR" : { amount : [], name : "Crystallized Aqua"}, //Vhis
	"purpleR" : { amount : [], name : "Crystallized Purple"},//
	"yellowR" : { amount : [], name : "Crystallized Yellow"}
};
//Here is the save function. It saves your data into the user local storage.
function save(){
	var save = {
   		gameG: gameG,
		gameR: gameR,
		gameB: gameB,
   		resources: resources,
		upgrades : upgrades,
		items : items,
		techs: techs,
		settings : settings,
		distortion : distortion
    }
    localStorage.setItem("save",JSON.stringify(save));
}
function load(){
	var savegame = JSON.parse(localStorage.getItem("save"));
	//TODO load that checks if something was in an object before;
	if (savegame != undefined|| null){
		if (savegame.gameG !== undefined || null) gameG = savegame.gameG;
		if (savegame.gameR !== undefined || null) gameR = savegame.gameR;
		if (savegame.gameR !== undefined || null) gameB = savegame.gameB;
		if (savegame.resources !== undefined || null) resources = savegame.resources;
		if (savegame.upgrades !== undefined || null) upgrades = savegame.upgrades;
		if (savegame.upgrades !== undefined || null) upgrades = savegame.upgrades;
		if (savegame.techs !== undefined || null) techs = savegame.techs;
		if (savegame.settings !== undefined || null) settings = savegame.settings;
		if (savegame.distortion !== undefined || null) distortion = savegame.distortion;
		changeGame(settings.currentGame);
		loadGameG();
		loadGameR();
		loadGameB();
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
		newGameB("Hi");
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
			//if(obj.amount.length > 0) document.getElementById("resources").innerHTML += "-------------------------------<br />";
			for(var i = 0; i < obj.amount.length; i++){
				if(obj.amount[i] != 0){
					document.getElementById("resources").innerHTML += obj.name+ " " + (i+1) + " : "+ obj.amount[i]+ "<br />";
				}
				//TODO low prio roman numerals?
				//TODO sort by level?
			}
		}
		else if(obj.amount != 0){
			document.getElementById("resources").innerHTML += obj.name + " : "+ obj.amount+ "<br />";
		}
	}
	for(var res in runes){
		var obj = runes[res];
		for(var i = 0; i < obj.amount.length; i++){
			if(obj.amount[i] != 0){
				document.getElementById("resources").innerHTML += res+ " Runes " + (i+1) + " : "+ obj.amount[i]+ "<br />";
			}
			//TODO low prio roman numerals?
			//TODO sort by level?
		}
	}
}
function resetDistortion(){
	for(var dis in distortion){
		var obj = distortion[dis];
		if(obj.amount.constructor === Array){
			obj.amount = [];
		}
		else{
			obj.amount = 0;
		}
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