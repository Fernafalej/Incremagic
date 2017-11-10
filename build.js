var gameB = {
	playfield :[],
	rowMax: 5,
	colMax: 5,
	row: 4,
	col: 4,
	ignoreRuneDimensions : false,
	maxDistance: 3,
	radiation: 0,
	clustering : 1,
	currentRune : "",
	currentLevel : 0,
	levelMult : 2,
	nextCrystal:{name: "none", level : 0},
	colorsNeeded: {},
	isWon: false,
}
var colorOfFields = {};
function loadGameB(newRune){
	if(gameB.isWon){
		buildTable("buildT",1,1);
		buildTable("buildItemsT",1,1);
		document.getElementById("buildT").rows[0].cells[0].innerHTML = "It is aching for a new Rune!";
		document.getElementById("buildT").rows[0].cells[0].style.backgroundColor = "lightgrey";
		document.getElementById("buildItemsT").rows[0].cells[0].innerHTML = "Nothing useful";
		document.getElementById("buildItemsT").rows[0].cells[0].style.backgroundColor = "lightgrey";
	}
	else{
		buildTable("buildT",gameR.row,gameR.col);
		buildTable("buildItemsT",1,1);
		if (gameB.playfield[0] !== undefined){
			for(var i =0; i < gameB.row; i++){
				for(var j = 0; j < gameB.col; j++){
					updateFieldR(i,j);
				}
			}
			document.getElementById("buildItemsT").rows[0].cells[0].innerHTML = gameB.nextCrystal.level;
			document.getElementById("buildItemsT").rows[0].cells[0].style.backgroundColor = gameB.nextCrystal.name;
		}
	}
}
function newGameB(newRune,l){
	buildDistortion();
	gameB.currentRune = newRune;
	gameB.currentLevel = l;
	gameB.isWon = false;
	var rune = buildRecipes[newRune];
	if(!gameB.ignoreRuneDimensions){
		gameB.row = rune.row;
		gameB.col = rune.col;
	}
	buildTable("buildT",gameB.row,gameB.col);
	buildTable("buildItemsT",1,1);

	var notInUse = [];
	for(var i = 0; i < gameB.row; i++){
		gameB.playfield[i] = [];
		for(var j = 0; j < gameB.col; j++){
			gameB.playfield[i][j] = {
				color : "white",
				demand : 0,
				placed :  false,
				crystal : 0,
			};
			var s = i + " " + j;
			notInUse.push(s);
			updateFieldB(i,j);
		}
	}
	
	var total = 0;
	var prob = [];
	var mult = Math.pow(gameB.levelMult,gameB.currentLevel);
	var i = 0;
	var test = [];
	colorOfFields = {};
	for(var res in rune.amount){
		total += rune.amount[res]*mult;
		prob[i] = rune.amount[res]*mult;
		test[i] = res;
		colorOfFields[res] = [];
		gameB.colorsNeeded[res] = rune.amount[res];
		i++;		
	}
	while(total > 0){
		if(notInUse.length > 0){
			var color = Math.floor(Math.random()*prob.length);
			var searchingColor = true;
			while(searchingColor){
				if(prob[color] > 0){
					searchingColor = false;
					var amount = Math.ceil(Math.random()*prob[color]);
					var field = Math.floor(Math.random()*notInUse.length);
					field = notInUse[field];					
					buildClusterB(field,amount,notInUse,test[color]);
					prob[color] -= amount;
					total -= amount;
				}
				else if(color < prob.length - 1){
					color++;
				}
				else{
					color = 0;
				}
			}
		}
		else{
			for(var i = 0; i < prob.length; i++){
				var color = test[i];
				while(prob[i] > 0){
					if(colorOfFields[color].length == 0){
						newGameB(newRune,l);
						return;
					}
					var field = Math.floor(Math.random()*colorOfFields[color].length);
					field = colorOfFields[color][field];
					var a = Math.ceil(Math.random()*prob[i]);
					var x = field.indexOf(" ");
					var rt = parseInt(field.substring(0,x));
					var ct = parseInt(field.substring(x+1));
					gameB.playfield[rt][ct].demand += a;
					prob[i] -= a;
					total -= a;
					updateFieldB(rt,ct);
				}
			}
		}
	}
	nextCrystal();
}
function buildDistortion(){
	//TODO
}
function updateFieldB(r,c){
	if(gameB.playfield[r][c].placed){
		document.getElementById("buildT").rows[r].cells[c].style.backgroundColor = gameB.playfield[r][c].color;
		document.getElementById("buildT").rows[r].cells[c].style.color = "black";
		document.getElementById("buildT").rows[r].cells[c].innerHTML = gameB.playfield[r][c].crystal;
	}
	else{
		if(gameB.playfield[r][c].demand == 0){
			document.getElementById("buildT").rows[r].cells[c].style.color = "darkgrey"
		}
		else{
			document.getElementById("buildT").rows[r].cells[c].style.color = gameB.playfield[r][c].color;
		}
		document.getElementById("buildT").rows[r].cells[c].style.backgroundColor = "darkgrey";
		document.getElementById("buildT").rows[r].cells[c].onclick = function(){placeCrystal(this)};
		document.getElementById("buildT").rows[r].cells[c].innerHTML = gameB.playfield[r][c].demand;
	}
}
function buildClusterB(field,amount,useableFields,color){
	var closeFields = [];
	var coloredFields = [];
	var x = field.indexOf(" ");
	var r = parseInt(field.substring(0,x));
	var c = parseInt(field.substring(x+1));
	for(var i = 0; i < useableFields.length; i++){
		var s = useableFields[i];
		x = s.indexOf(" ");
		var rt = parseInt(s.substring(0,x));
		var ct = parseInt(s.substring(x+1));
		var t = Math.abs(r-rt)+ Math.abs(c-ct);
		if(t <= gameB.clustering){
			closeFields.push(s);
		}
	}
	var amt = amount;
	while(amt > 0){
		if(closeFields.length > 0){
			var f = Math.floor(Math.random()*closeFields.length);
			f = closeFields[f];
			x = f.indexOf(" ");
			var rt = parseInt(f.substring(0,x));
			var ct = parseInt(f.substring(x+1));
			var t = Math.abs(r-rt)+ Math.abs(c-ct);
			var a = Math.ceil(Math.random()*amt*((gameB.clustering+1-t)/(gameB.clustering+1)));
			gameB.playfield[rt][ct].color = color;
			gameB.playfield[rt][ct].demand += a;
			amt -= a;
			var s = rt + " "+ ct;
			pop(closeFields,s);
			pop(useableFields,s);
			coloredFields.push(s);
			colorOfFields[color].push(s);
			updateFieldB(rt,ct);
		}
		else{
			var f = Math.floor(Math.random()*coloredFields.length);
			f = coloredFields[f];
			var a = Math.ceil(Math.random()*amt);
			x = f.indexOf(" ");
			var rt = parseInt(field.substring(0,x));
			var ct = parseInt(field.substring(x+1));
			gameB.playfield[rt][ct].demand += a;
			amt -= a;
			updateFieldB(rt,ct);
		}
	}
}
function placeCrystal(cell){
	if(gameR.nextStone.name != "none"){
		var r = cell.parentNode.rowIndex;
		var c = cell.cellIndex;	
		if(!gameB.playfield[r][c].placed && gameB.playfield[r][c].demand <= gameB.nextCrystal.level && 
			(gameB.playfield[r][c].color == "white" ||  gameB.playfield[r][c].color == gameB.nextCrystal.name)){
			gameB.playfield[r][c].placed = true;
			gameB.colorsNeeded[gameB.nextCrystal.name] -= gameB.playfield[r][c].demand;
			gameB.playfield[r][c].demand = 0;
			gameB.playfield[r][c].color = gameB.nextCrystal.name;
			gameB.playfield[r][c].crystal = gameB.nextCrystal.level;
			updateFieldB(r,c);			
			var temp = gameB.nextCrystal.name+"R";
			resources[temp].amount[gameB.nextCrystal.level-1]--;
			updateResources();
			resonateCrystal(r,c);
			nextCrystal();
		}
	}
	else{
		nextCrystal();
	}
}
function nextCrystal(){	
	var prob = [];
	var i = 0;
	var max = 0;
	var i = 0;
	for(var res in gameB.colorsNeeded){
		var arr =[max];
		if(gameB.colorsNeeded[res] > 0){
			res +="R";
			var obj = resources[res];
			
			
			for(var j = 0; j < obj.amount.length; j++){				
					max += Math.floor(obj.amount[j]);
					arr[j] = max;
			}
		}
		prob[i] = {amount : arr, name : res};
		i++
	}
	if(max != 0){
		var rn = Math.random()*max;
		var name = prob[0].name;
		var level = 1;
		for(var i = prob[0].amount.length-1; i >= 0; i--){
			if(rn > prob[0].amount[i]){
						level = i+2;
						i = -1;
					}
		}
		for(var i = prob.length-1; i >= 0; i--){
			if(rn > prob[i].amount[prob[i].amount.length-1]){
				name = prob[i+1].name;
				for(var j = prob[i+1].amount.length-1; j >= 0; j--){
					if(rn > prob[i+1].amount[j]){
						level = j+2;
						i = -1;
						j = -1;
					}
				}
				i = -1;
			}
		}
		updateNextCrystal(name, level);
		return;
	}
	else{
		updateNextCrystal("none ", "Nothing useful");
	}
}
function resonateCrystal(r,c){
	for(var i = -1*gameB.maxDistance;i <= gameB.maxDistance;i++){
		var temp = Math.abs(Math.abs(i)-gameB.maxDistance);
		if(r+i >= 0 && r+i < gameB.row){
			for(var j = -1*temp; j <= temp; j++){
				if(c+j >= 0 && c+j < gameB.row){
					if(gameB.playfield[r+i][c+j].demand > 0 && gameB.playfield[r+i][c+j].color == gameB.playfield[r][c].color){
						var strength = gameB.playfield[r][c].crystal - (Math.abs(i)+Math.abs(j));
						if(strength > 0){
							if(gameB.playfield[r+i][c+j].demand  <  strength){
								gameB.colorsNeeded[gameB.playfield[r+i][c+j].color] -= gameB.playfield[r+i][c+j].demand;
								gameB.playfield[r+i][c+j].demand = 0;
								gameB.playfield[r+i][c+j].color = "white";
							}
							else{
								gameB.colorsNeeded[gameB.playfield[r+i][c+j].color] -= strength;
								gameB.playfield[r+i][c+j].demand -= strength;
							}
							updateFieldB(r+i,c+j);
						}
					}
				}
			}
		}
	}
	checkForRune();
}
function updateNextCrystal(name, level){
	document.getElementById("buildItemsT").rows[0].cells[0].innerHTML = level;
	document.getElementById("buildItemsT").rows[0].cells[0].style.backgroundColor = name.substring(0,name.length-1);
	document.getElementById("buildItemsT").rows[0].cells[0].onclick = function(){
		distortCrystal();
		nextCrystal();
	};
	gameB.nextCrystal.name = name.substring(0,name.length-1);
	gameB.nextCrystal.level = level;
}
function checkForRune(){
	var done = true;
	for(var res in gameB.colorsNeeded){
		if(gameB.colorsNeeded[res] > 0){
			done = false;
			break;
		}
	}
	if(done){
		if(runes[gameB.currentRune] == undefined){
			runes[gameB.currentRune] = [];
		}
		if(runes[gameB.currentRune][gameB.currentLevel] == undefined){
			runes[gameB.currentRune][gameB.currentLevel] = 0;
		}
		runes[gameB.currentRune][gameB.currentLevel]++;
		updateResources();
		buildTable("buildT",1,1);
		buildTable("buildItemsT",1,1);
		document.getElementById("buildT").rows[0].cells[0].innerHTML = gameB.currentRune + " Rune "+ (gameB.currentLevel +1) + " was build!";
		document.getElementById("buildT").rows[0].cells[0].style.backgroundColor = "lightgrey";
		document.getElementById("buildItemsT").rows[0].cells[0].innerHTML = "Nothing useful";
		document.getElementById("buildItemsT").rows[0].cells[0].style.backgroundColor = "lightgrey";
		gameB.isWon = true;
	}
}
function distortCrystal(){
	//TODO
}
function isRuneBuildable(rune,level){
	if(level > -1){
		return false;
	}
	else{
		return true;
	}
}