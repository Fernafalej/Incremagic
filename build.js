var gameB = {
	playfield : [],
	bRowMax : 9,
	bColMax : 9,
	bRow : 5,
	bCol : 5,
	currentRecipe : "",
	currentLevel: 0,
	radiation : 0.125,
	maxDistance: 3,
	nextCrystal:{name: "none", level : 0},
	fontsize: "TODO",
}
var chainB = [];
var recipes = {
	"Hi": {
		row: 3,
		col: 3,
		importantFields:
			[{row : 1,
			col : 1,
			demands: {
				"green" : 1, "red": 1, "blue":1, "aqua":1, "purple": 1, "yellow" :1
				}
			}]
	}
}
function loadGameB(){
	buildTable("buildT",gameB.bRow,gameB.bCol);
	buildTable("buildItemsT",1,2);
	if (gameB.playfield[0] !== undefined){
		for(var i =0; i < gameB.bRow; i++){
			for(var j = 0; j < gameB.bCol; j++){
				updateFieldB(i,j);
			}
		}
		document.getElementById("buildItemsT").rows[0].cells[0].style.backgroundColor = "lightgrey";
		document.getElementById("buildItemsT").rows[0].cells[0].style.fontSize = "25px";
		document.getElementById("buildItemsT").rows[0].cells[1].innerHTML = gameB.nextCrystal.level;
		document.getElementById("buildItemsT").rows[0].cells[1].style.backgroundColor = gameB.nextCrystal.name;
	}
	else{
		newGameG();
	}
}
function newGameB(name){
	if(recipes[name] == undefined){
		return false;
	}
	if(recipes[name].row > gameB.bRowMax || recipes[name].row > gameB.bColMax){
		return false;
	}
	buildDistortion();
	buildTable("buildT",gameB.bRow,gameB.bCol);
	buildTable("buildItemsT",1,2);
	document.getElementById("buildItemsT").rows[0].cells[0].style.fontSize = "25px";
	for(var i = 0; i < gameB.bRow; i++){
		gameB.playfield[i] = [];
		for(var j = 0; j < gameB.bCol; j++){
			gameB.playfield[i][j] = {type : {color : "white", level : " ", important : {is : false, demand : {}}}
									, upgrade: 0, charge : {"green" : [], "red": [], "blue":[], "aqua":[], "purple": [], "yellow" :[]}
									, tooltip : ""};
			for(var k = 0; k < gameB.distance; k++){
				for(var res in gameB.playfield[i][j].charge ){
					gameB.playfield[i][j].charge[res][k]=0;
				}
			}
			updateFieldB(i,j);
		}
	}
	gameB.currentRecipe = name;
	positionImpFields(name);
	nextCrystal();
}
function buildDistortion(){
	//TODO
}
function positionImpFields(name){
	var rowShift = Math.floor((gameB.bRow - recipes[name].row)/2);
	var colShift = Math.floor((gameB.bCol - recipes[name].col)/2);
	for(var i = 0; i < recipes[name].importantFields.length; i++){
		var r = recipes[name].importantFields[i].row;
		var c = recipes[name].importantFields[i].col;
		gameB.playfield[r+rowShift][c+colShift].type.important =
				{is: true, demand : recipes[name].importantFields[i].demands};
		gameB.playfield[r+rowShift][c+colShift].type.color = "lightgrey";
		updateFieldB(r+rowShift,c+colShift);
	}
}
function updateFieldB(r,c){
	updateTooltip(r,c);
	document.getElementById("buildT").rows[r].cells[c].style.backgroundColor = gameB.playfield[r][c].type.color;
	document.getElementById("buildT").rows[r].cells[c].innerHTML = gameB.playfield[r][c].type.level;
	document.getElementById("buildT").rows[r].cells[c].onclick = function(){placeCrystal(this)};
	document.getElementById("buildT").rows[r].cells[c].onmouseover = function(){showDetailsB(this)};
}
function updateTooltip(r,c){
	var f = gameB.playfield[r][c];
	var temp = "";
	if(f.type.important.is){
		//var temp = "";
		for(var res in f.charge){
			if(f.type.important.demand[res] > 0){
				var sum = 0;
				for(var i = 0; i < f.charge[res].length; i++){
					sum += f.charge[res][i];
				}
				temp += "<span style='color:" + res +"'>"+ sum + " : " + f.type.important.demand[res] + "</span></br>";
			}
		}
	}
	else{
		//var temp = "";
		for(var res in f.charge){
			var sum = 0;
			for(var i = 0; i < f.charge[res].length; i++){
				sum += f.charge[res][i];
			}
			if(sum > 0){
				temp += "<span style='color:" + res +"'>" + sum + "</span></br>";
			}
		}
	}
	f.tooltip = temp;
	console.log(f.tooltip);
}
function nextCrystal(){
	var prob = [];
	var i = 0;
	var max = 0;
	for(var res	in resources){
		var obj = resources[res];
		if(obj.amount.constructor === Array){
			var arr = [max];
			for(var j = 0; j < obj.amount.length; j++){				
				max += Math.floor(obj.amount[j]);
				arr[j] = max;
			}
			prob[i] = {amount : arr, name : res};
			i++;		
		}
	}
	if(max != 0){
		var rn = Math.random()*max;
		console.log(rn);
		var name = prob[0].name;
		var level = 1;
		for(var i = prob.length-1; i >= 0; i--){
			if(rn > prob[i].amount[prob[i].amount.length-1]){
				name = prob[i+1].name;
				level = 1;
				for(var j = prob[i+1].amount.length-1; j >= 0; j--){
					if(rn > prob[i+1].amount[j]){
						i = -1;
						level = j+2;
					}
				}
				i = -1;
			}
		}
		updateNextCrystal(name, level);
		return;
	}
	else{
		updateNextCrystal("none ", "Empty");
	}
}
function placeCrystal(cell){
	if(gameB.nextCrystal.name != "none"){
		if(cell.style.backgroundColor == "white"){
			var r = cell.parentNode.rowIndex;
			var c = cell.cellIndex;
			if(!gameB.playfield[r][c].type.important.is){
				gameB.playfield[r][c].type.color = gameB.nextCrystal.name;
				gameB.playfield[r][c].type.level = gameB.nextCrystal.level;
				gameB.playfield[r][c].charge[gameB.nextCrystal.name][0] = gameB.nextCrystal.level;
				updateFieldB(r,c);
				var temp = gameB.nextCrystal.name+"R";
				resources[temp].amount[gameB.nextCrystal.level-1]--;
				updateFieldB(r,c);
				updateResources();
				checkCrystals(r,c);
				chainB = [];
				checkImportantFields();
				nextCrystal();
			}
		}
	}
	else{
		nextCrystal();
	}
}
function updateNextCrystal(name, level){
	document.getElementById("buildItemsT").rows[0].cells[1].innerHTML = level;
	document.getElementById("buildItemsT").rows[0].cells[1].style.backgroundColor = name.substring(0,name.length-1);
	gameB.nextCrystal.name = name.substring(0,name.length-1);
	gameB.nextCrystal.level = level;
}
function showDetailsB(cell){
	var r = cell.parentNode.rowIndex;
	var c = cell.cellIndex;
	document.getElementById("buildItemsT").rows[0].cells[0].style.backgroundColor = 
		gameB.playfield[r][c].type.color;
	document.getElementById("buildItemsT").rows[0].cells[0].innerHTML = gameB.playfield[r][c].tooltip;
}
function checkCrystals(r,c){
	buildChainB(r,c,0);
	for(var d = 1; d < gameB.maxDistance; d++){
		for(var i = 0;  i < chainB.length; i++){
			if(chainB[i].distance == d){
				recalcCrystal(chainB[i]);
			}
		}
	}
}
function buildChainB(r,c,d){
	var temp = {row : r, col: c, distance: d}
	if(isObjectInArray(temp,chainR)){
		chainB.push = temp;
		if(d < maxDistance){
			if(r > 0){
				var tr = r-1;
				var tc = c;
				checkCrystals(tr,tc,d+1);
			}
			if(r < gameB.bRow-1){
				var tr = r+1;
				var tc = c;
				checkCrystals(tr,tc,d+1);
			}
			if(c > 0){
				var tr = r;
				var tc = c-1;
				checkCrystals(tr,tc,d+1);
			}
			if(c < gameB.bCol-1){
				var tr = r;
				var tc = c+1;
				checkCrystals(tr,tc,d+1);
			}
		}
	}
}
function recalcCrystal(obj){
	var r = obj.row;
	var c = obj.col;
	var d = obj.distance;
	for(var res in gameB.playfield[r][c].color){
		var temp = 0;
		if(r > 0){
			var tr = r-1;
			var tc = c;
			temp += gameB.playfield[tr][tc].color[res][d];
		}
		if(r < gameB.bRow-1){
			var tr = r+1;
			var tc = c;
			temp += gameB.playfield[tr][tc].color[res][d];
		}
		if(c > 0){
			var tr = r;
			var tc = c-1;
			temp += gameB.playfield[tr][tc].color[res][d];
		}
		if(c < gameB.bCol-1){
			var tr = r;
			var tc = c+1;
			temp += gameB.playfield[tr][tc].color[res][d];
		}
		gameB.playfield[r][c].color[res][d] = temp;
	}
	updateTooltip(r,c); //maybe not make it do that a thousand times!
}
function checkImportantFields(){
	//TODO
}