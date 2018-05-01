window.onload = function (){
	//buildTable("gatherT",10,10);

	generateDefaults();
	loadEventListeners();
	displayVersion();
	load();
	buildAllResources();
	displayColorSettings();
	changeColorEvents();
	if(settings.init == false){
		settings.init = true;
		save();
	}
	settings.autosave.autosaveId = setInterval(function(){
		if(settings.idle.timePassed < settings.idle.timeNeeded){
			settings.idle.timePassed += settings.autosave.amount;
		}
		if(settings.idle.timePassed >= settings.idle.timeNeeded){
			settings.idle.idling = true;
			settings.time += settings.autosave.amount;
		}
		save();
	}, settings.autosave.amount);
}
document.onpointerdown = function(){
	settings.idle.timePassed = 0;
	settings.idle.idling = false;
}
function save(){
	var save = {
		settings: settings,
		resources: resources,
		gather:gather,
		timestamp: Date.now(),
	};
	localStorage.setItem("save",JSON.stringify(save));
	//console.log(JSON.stringify(save));
}

function load(){
	var savegame = JSON.parse(localStorage.getItem("save"));
	//TODO version update
	if (savegame != undefined){
		settings = savegame.settings;
		resources = savegame.resources,
		gather = savegame.gather;
		settings.time += (Date.now() - savegame.timestamp);
		
	}
	changeCollection(settings.currentCollection);
	changeGame(settings.currentGame);
	loadGather();
	loadRefine();
}

function deleteSave(){
	localStorage.removeItem("save");
	location.reload(true);
}
function cellAt(table,row,cell){
	return document.getElementById(table).childNodes[row].childNodes[cell];
}

function getCellWithId(id){
	var ir = id.indexOf("row");
	var ic = id.indexOf("cell");
	var table = id.slice(0,ir);
	var row = id.slice(ir+3, ic);
	var cell = id.slice(ic+4);
	return([table,row,cell]);
	
}
