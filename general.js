var resources = {
	"greenG" : { amount : 0 , name : "Green Essence"},//
	"redG" : { amount : 0, name : "Red Essence"},	//
	"blueG" : { amount : 0, name : "Blue Essence"}, //Ier
	"aquaG" : { amount : 0, name : "Aqua Essence"}, //Vhis
	"purpleG" : { amount : 0, name : "Purple Essence"},//
	"yellowG" : { amount : 0, name : "Yellow Essence"},//
	"greenR" : { amount : [] , name : "Crystallized Green"},//
	"redR" : { amount : [], name : "Crystallized Red"},	//
	"blueR" : { amount : [],name : "Crystallized Blue"}, //Ier
	"aquaR" : { amount : [], name : "Crystallized Aqua"}, //Vhis
	"purpleR" : { amount : [], name : "Crystallized Purple"},//
	"yellowR" : { amount : [], name : "Crystallized Yellow"}
	//TODO better names
}
var runes = {
	
}
var items ={
	"gameR" : {
		 
	},
	"gameG" : {
		 
	},
	"gameB" : {
		 
	}
}
var techs = {
	"gameR" : {
		 
	},
	"gameG" : {
		 
	},
	"gameB" : {
		 
	}
}
var settings = {
	autosave : { amount: 30000, autosaving : true, autosaveID :""},
	init: false,
	currentGame: "build",
	version : 0.1,
};
var distortion = {
	gather: {
		"green" : { amount : 0 , name : "Green Essence"},//
		"red" : { amount : 0, name : "Red Essence"},	//
		"blue" : { amount : 0, name : "Blue Essence"}, //Ier
		"aqua" : { amount : 0, name : "Aqua Essence"}, //Vhis
		"purple" : { amount : 0, name : "Purple Essence"},//
		"yellow" : { amount : 0, name : "Yellow Essence"},//
	},
	refine: {
		"green" : { amount : [] , name : "Crystallized Green"},//
		"red" : { amount : [], name : "Crystallized Red"},	//
		"blue" : { amount : [], name : "Crystallized Blue"}, //Ier
		"aqua" : { amount : [], name : "Crystallized Aqua"}, //Vhis
		"purple" : { amount : [], name : "Crystallized Purple"},//
		"yellow" : { amount : [], name : "Crystallized Yellow"}
	},
	build: {
		
	},
};
var experience = {
	gather: 0,
	refine: 0,
	build: 0,
}
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
		distortion : distortion,
		experience : experience,
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
		if (savegame.experience !== undefined || null) experience = savegame.experience;
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
	var z = document.getElementsByClassName("navigation");
	for(var i = 0; i < x.length; i++){
		x[i].style.display = "none";
	}
	for(var i = 0; i < y.length; i++){
		y[i].style.display = "none";
	}
	for(var i = 0; i < z.length; i++){
		z[i].style.display = "none";
	}
	document.getElementById(g).style.display = "inline";
	settings.currentGame = g;
	var ig = g+ "Items";
	var ng = g+ "Nav";
	document.getElementById(ig).style.display = "inline";
	document.getElementById(ng).style.display = "inline";
}
function changeGame2(g){
	var x = document.getElementsByClassName(settings.currentGame);
	for(var i = 0; i < x.length; i++){
		x[i].style.display = "none";
	}
	x = document.getElementsByClassName(g);
	 for(var i = 0; i < x.length; i++){
		x[i].style.display = "inline";
	}
	settings.currentGame = g;
}
function startGame(){
	changeGame("gather");
	load();
	if(settings.init == false){
		newGameG();
		newGameR();
		//newGameB('Asa',0);
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
			document.getElementById("resources").innerHTML += obj.name + " : "+ Math.floor((obj.amount*10))/10+ "<br />";
		}
	}
	for(var res in runes){
		var obj = runes[res];
		for(var i = 0; i < obj.length; i++){
			if(obj[i] != 0){
				document.getElementById("resources").innerHTML += res+ " Runes " + (i+1) + " : "+ obj[i]+ "<br />";
			}
			//TODO low prio roman numerals?
			//TODO sort by level?
		}
	}
}
function resetDistortion(){
	for(var dis in distortion){
		var obj = distortion[dis];
		for(var col in obj){
			if(obj[col].constructor === Array){
				obj[col] = [];
			}
			else{
				obj[col] = 0;
			}
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
function objectLength(obj){
	var t = 0;
	for(var res in obj){
		t++;
	}
	return t;
}
function pop(array,ele){
	var p = array.indexOf(ele);
	if( p != -1){
		array.splice(p,1);
	}	
	return p;
}
function openMovePanel(){
	document.getElementById("movePanel").style.display = "inline";
}
function closeMovePanel(){
	document.getElementById("movePanel").style.display = "none";
}
function openNewGameB(){
	updateNewGameBPanel();
	document.getElementById("newGameB").style.display = "inline";
}
function closeNewGameB(){
	document.getElementById("newGameB").style.display = "none";
}
function openCraftPanel(){
	updateUpgradeList();
	document.getElementById("craftPanel").style.display = "inline";
}
function closeCraftPanel(){
	document.getElementById("craftPanel").style.display = "none";
}
function updateNewGameBPanel(){
	document.getElementById("chooseableRunes").innerHTML = "";
	for(var rune in buildRecipes){
		if(isRuneBuildable(rune,0)){
			var chooseMe = document.createElement("DIV");
			var picRune = document.createElement("DIV");
			var describeRune = document.createElement("DIV");
			var newRune = document.createElement("DIV");
			var input = document.createElement("input");
			var newGame = document.createElement("div");
			chooseMe.id = "choose"+rune;
			chooseMe.className = "chooseMe";
			document.getElementById("chooseableRunes").appendChild(chooseMe);
			picRune.id = "pic"+rune;
			picRune.className = "picRune";
			chooseMe.appendChild(picRune);
			describeRune.id = "describe"+rune;
			describeRune.className = "describeRune";
			describeRune.innerHTML = buildRecipes[rune].description;
			picRune.appendChild(describeRune);
			newRune.id = "new"+rune;
			newRune.className = "newRune";
			newRune.innerHTML = rune + " Rune ";
			chooseMe.appendChild(newRune);
			input.type = "number";
			input.id = "input"+rune;
			newRune.appendChild(input);
			input.style = "width: 40px; background:inherit; border: none; color:inherit";
			input.value = 0;
			input.min = 0;
			input.max = maxRuneLevel(rune);
			newRune.appendChild(newGame);
			newGame.innerHTML = "Build";
			newGame.id = "Start"+rune;
			newGame.className = "startRune";
			var t = 'input'+rune;
			newGame.onclick = function(){
				var rune = this.id;
				rune = rune.slice(5);
				var input = "input" + rune;
				var max = document.getElementById(input).max;
				input = document.getElementById(input).value;
				input = Math.max(max,input);
				newGameB(rune,input);
				closeNewGameB();
			};
		}
	}
}
function updateUpgradeList(){
	document.getElementById("upgradeList").innerHTML = "";
	for(var res in craftRecipesUpgrades){
		var obj = craftRecipesUpgrades[res];
		if(obj.unlocked){
			var unlockedUpgrade = document.createElement("div");
			var upgradeHover = document.createElement("div");
			document.getElementById("upgradeList").appendChild(unlockedUpgrade);
			unlockedUpgrade.className = "unlockedUpgrade";
			unlockedUpgrade.id = "upgrade"+res;
			unlockedUpgrade.innerHTML = obj.name;
			upgradeHover.className = "upgradeHover";
			upgradeHover.id = "upgradeHover"+res;
			upgradeHover.innerHTML = "Dumb";
			unlockedUpgrade.appendChild(upgradeHover);
		}
	}
}
function updateItemList(){
	//TODO
}
function updateTechList(){
	//TODO
}