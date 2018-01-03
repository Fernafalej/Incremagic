function showId(id){
	document.getElementById(id).style.display = document.getElementById(id).defaultDisplay;
}
function hideId(id){
	document.getElementById(id).style.display = "none";
}
function showElement(element){
	element.style.display = element.defaultDisplay;
}
function hideElement(element){
	element.style.display = "none";
}

/*function buildTable(table,rows,cols){
	var t = document.getElementById(table);
	deconstructTable(t);
	for(var i = 0; i < rows; i++){
		var row = document.createElement("DIV");
		row.className = "row";
		t.appendChild(row);
		for(var j = 0; j < cols; j++){
			var cell = document.createElement("DIV");
			cell.className = "cell";
			cell.id= table + "row" + i + "cell" + j;
			row.appendChild(cell);
		}
	}
}*/

function buildTableBalanced(table,rows,cols){
	var t = document.getElementById(table);
	var width = 100/cols + "%";
	var height = 100/rows + "%";
	deconstructTable(t);
	for(var i = 0; i < rows; i++){
		var row = document.createElement("DIV");
		row.className = "row";
		t.appendChild(row);
		for(var j = 0; j < cols; j++){
			var cell = document.createElement("DIV");
			row.appendChild(cell);
			cell.className = "cell";
			cell.style.width=width;
			cell.style.maxwidth = width;
			cell.style.height = height;
			cell.style.maxheight = height;
			cell.id= table + "row" + i + "cell" + j;
			//cell.innerHTML = "y";
		}
	}
}

function deconstructTable(table){
	table.innerHTML ="";
	/*
	if(document.getElementById(table) == null){
		return false;
	}
	var t = document.getElementById(table);
	var x = document.getElementById(table).childNodes.length;
	for(var i = 0; i < x; i++){
		t.deleteRow(0);
	}
	return x;*/
}

function changeCollection(g){
	var x = document.getElementsByClassName(settings.currentCollection);
	for(var i = 0; i < x.length; i++){
		x[i].style.display = "none";
	}
	x = document.getElementsByClassName(g);
	for(var i = 0; i < x.length; i++){
		x[i].style.display = x[i].defaultDisplay;
	}
	settings.currentCollection = g;
}
function changeGame(g){
	var x = document.getElementsByClassName(settings.currentGame);
	for(var i = 0; i < x.length; i++){
		x[i].style.display = "none";
	}
	x = document.getElementsByClassName(g);
	 for(var i = 0; i < x.length; i++){
		x[i].style.display = x[i].defaultDisplay;
	}
	settings.currentGame = g;
}
function generateDefaults(){
	var init = ["gather","refine","build","gatherU","refineU","buildU","hidden",
				"puzzles",];
	for(var i = init.length-1; i >= 0; i--){
		var classElems = document.getElementsByClassName(init[i]);
		for(var j = 0; j < classElems.length; j++){
			var elem = classElems[j];
			elem.defaultDisplay = window.getComputedStyle(elem, null).getPropertyValue("display");
			elem.style.display = "none";
		}
	}
}
function displayVersion(){
	var elem = document.getElementById("showversion");
	var str = settings.version[0];
	for(var i = 1; i < settings.version.length; i++){
		str += "." + settings.version[i];
	}
	elem.innerHTML = str;
}
function displayColorSettings(){
	for(var color in settings.colors){
		var div = document.createElement("DIV");
		div.id = "settings"+color;
		document.getElementById("colorSettings").appendChild(div);
		var info = document.createElement("DIV");
		info.id = "info"+color;
		info.style.color = color;
		div.appendChild(info);
		info.innerHTML = color.charAt(0).toUpperCase() + color.slice(1) + " : ";
		var input = document.createElement("INPUT");
		input.id = "input" + color;
		input.type = "color";
		input.value = settings.colors[color];
		info.appendChild(input);
		var reset = document.createElement("SPAN");
		reset.innerHTML = "Reset";
		reset.style.background = color;
		reset.id = "reset" + color;
		info.appendChild(reset);
		reset.className = "resetButton";
	}
}

function buildResource(path,level){
	var id = "resource";
	var res = resources;
	var div = document.createElement("DIV");
	for(var i = 0; i < path.length; i++){
		id += path[i];
		res = res[path[i]];
	}
	
	div.className +=" resources" + path[0] +" resources" + path[0] + "position" + res.position +" resources" + path[0]+"position" + res.position+ "level"+level;
	id += level;
	div.id = id;
	div.style.display = "inline";
	var name = document.createElement("SPAN");
	name.innerHTML = res.name +" : ";
	if(level != 0){
		name.innerHTML += res.name + " " +level +" : ";
	}
	name.id = id+"name";
	div.appendChild(name);
	value = document.createElement("SPAN");
	value.id = id+"value";
	value.innerHTML =" "+ res["amount"][level];	
	div.appendChild(value);
	
	var position = document.getElementsByClassName("resources" + path[0]+"position" + res.position+ "level"+(level-1))[0];
	if(position != undefined && position != null){
		document.getElementById("resources" + path[0]).insertBefore(div,position.nextSibling);
	}
	else{
		position = document.getElementsByClassName("resources" + path[0]+"position" + res.position)[0];
		if(position != undefined && position != null){
			if(level > 0){
				build(path,level-1);
				position = document.getElementsByClassName("resources" + path[0]+"position" + res.position+ "level"+(level-1))[0];
				console.log(position);
				document.getElementById("resources" + path[0]).insertBefore(div,position.nextSibling);
			}
			else{
				console.log("What???");
				return;
			}
		}
		else{
			console.log(res);
			var i = res.position;
			console.log(i);
			while((position == undefined || position == null) && i > 0){
				position = document.getElementsByClassName("resources" + path[0]+"position" + i)[0];
				i--;
				console.log(position);
				console.log(i);
			}
			if((position != undefined && position != null)){
				console.log(i);
				console.log("resources" + path[0]);
				document.getElementById("resources" + path[0]).insertBefore(div,position.nextSibling);
			}
			else{
				position = document.getElementById("resources" + path[0]+"Title")
				console.log(position);
				console.log(position.nextSibling);
				document.getElementById("resources" + path[0]).insertBefore(div,position.nextSibling);
			}
		}
	}
}

function buildAllResources(){
	for(var group in resources){
		for(var type in resources[group]){
			for(var res in resources[group][type]){
				if( resources[group][type][res].amount == undefined){
					
				}
			}
		}
	}
	
}

function updateResource(path,level){
	var id = "resource";
	var res = resources;
	for(var i = 0; i < path.length; i++){
		id += path[i];
		res = res[path[i]];
	}
	id += level;
	var div = document.getElementById(id);
	if(div == null || div == undefined){
		buildResource(path,level)
	}
	var value = document.getElementById(id+"value");
	div = document.getElementById(id);
	value.innerHTML = " "+ res["amount"][level];
	div.style.display = "inline";
	if(res["amount"][level] == 0){
		div.style.display = "none";
	}
}