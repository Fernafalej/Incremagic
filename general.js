var resources = {
	"greenG" : { amount : 0 , name : "Balanced Green"},
	"redG" : { amount : 0, name : "Balanced Red"},
	"blueG" : { amount : 0, name : "Balanced Blue"},
	"aquaG" : { amount : 0, name : "Balanced Aqua"},
	"purpleG" : { amount : 0, name : "Balanced Purple"},
	"yellowG" : { amount : 0, name : "Balanced Yellow"}
	
};

var settings = {
	autoSave : { amount: 300000, autosaving : true}
};

var distortion = [];

//Here is the save function. It saves your data into the user local storage.
function save(){
	var save = {
   		gameG: gameG,
   		resources: resources,
		settings : settings
    }
    localStorage.setItem("save",JSON.stringify(save));
}

function load(){
	var savegame = JSON.parse(localStorage.getItem("save"));
	if (typeof savegame.gameG !== "undefined" || "null") currency = savegame.gameG;
	if (typeof savegame.resources !== "undefined" || "null") resources = savegame.resources;
	if (typeof savegame.settings !== "undefined" || "null") settings = savegame.settings;
	//Loading a game is this simple.
}

function deleteSave(){
	if(confirm('Do you really want to reset?')) {
		localStorage.removeItem('save');
		location.reload();
	}
	//This will delete the save item from the localStorage, at the same time reload the page.
}

function autoSave(){
	if(settings.autoSave.autosaving){
			console.log(settings);
	var temp = settings.autoSave.amount;
	setInterval(function(){save();console.log("Game Saved");autoSave()}, temp);
	}
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
	for(var i = 0; i < x.length; i++){
		x[i].style.display = "none";
	}
	document.getElementById(g).style.display = "inline";
}

function addRessource(ressource, a){
	//TODO
	var t = {name:ressource, amount:a};
	ressources.push(t);
}

function addDistortion(dist){
	var t = {name:dist, amount:0};
	distortion.push(t);
}

function isInArray(n,array){
	//array.forEach(if(name == n) return true;);
}

function startGame(){
	newGameG();
	autoSave();
}

function updateResources(){
	document.getElementById("resources").innerHTML = "";
	for (var res in resources) {
		var obj = resources[res];
		if(obj.amount != 0){
			document.getElementById("resources").innerHTML += obj.name + " : "+ obj.amount+ "<br />";
		}
	}
}
window.onload = (function(){
	load();
	updateResources();
})
