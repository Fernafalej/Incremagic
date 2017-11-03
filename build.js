var gameB = {
	playfield :[],
	rowMax: 5,
	colMax: 5,
	row: 4,
	col: 4,
	maxDistance: 3,
	radiation: 0,
	clustering : 1,
	currentRune : "",
	currentLevel : 0,
	levelMult : 2,
	nextCrystal:{name: "none", level : 0},
}
var colorOfFields = {};
function loadGameB(newRune){
	
}
function newGameB(newRune,l){
	buildDistortion();
	buildTable("buildT",gameB.row,gameB.col);
	buildTable("buildItemsT",1,1);
	gameB.currentRune = newRune;
	gameB.currentLevel = l;
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
	var rune = buildRecipes[newRune];
	var total = 0;
	var prob = [];
	var mult = Math.pow(gameB.levelMult,gameB.currentLevel);
	var i = 0;
	var test = [];
	for(var res in rune){
		total += rune[res]*mult;
		prob[i] = rune[res]*mult;
		test[i] = res;
		colorOfFields[res] = [];
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
	document.getElementById("buildT").rows[r].cells[c].style.color = gameB.playfield[r][c].color;
	document.getElementById("buildT").rows[r].cells[c].style.backgroundColor = "darkgrey";
	document.getElementById("buildT").rows[r].cells[c].onclick = function(){placeCrystal(this)};
	if(gameB.playfield[r][c].demand > 0) document.getElementById("buildT").rows[r].cells[c].innerHTML = gameB.playfield[r][c].demand;
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
		if(!gameB.playfield[r][c].placed && gameB.playfield[r][c].demand <= gameB.nextCrystal.level){
			gameB.playfield[r][c].placed = true;
			gameB.playfield[r][c].demand = 0;
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
	var colorsUsed = [];
	var prob = [];
	var i = 0;
	var max = 0;
	for(var res in buildRecipes[gameB.currentRune]){
		colorsUsed.push(res+"R");
	}
	for(var i = 0; i < colorsUsed.length; i++){
		var obj = resources[colorsUsed[i]];
		var arr = [max];
		for(var j = 0; j < obj.amount.length; j++){				
				max += Math.floor(obj.amount[j]);
				arr[j] = max;
		}
		prob[i] = {amount : arr, name : colorsUsed[i]};
	}
	if(max != 0){
		var rn = Math.random()*max;
		console.log(rn);
		var name = prob[0].name;
		var level = 1;
		for(var i = prob.length-1; i >= 0; i--){
			if(rn > prob[i].amount[prob[i].amount.length-1]){
				name = prob[i+1].name;
				for(var j = prob[i+1].amount.length-1; j >= 0; j--){
					if(rn > prob[i+1].amount[j]){
						console.log(prob[i+1].amount)
						i = -1;
						level = j+3;
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
function resonateCrystal(r,c){
	for(var i = -1*gameB.maxDistance;i <= gameB.maxDistance;i++){
		var temp = Math.abs(Math.abs(i)-gameB.maxDistance);
		if(r+i >= 0 && r+i < gameB.row){
			for(var j = -1*temp; j <= temp; j++){
				if(c+j >= 0 && c+j < gameB.row){
					if(gameB.playfield[r+i][c+j].demand > 0){
						var strength = gameB.playfield[r][c].crystal - (Math.abs(i-r)+Math.abs(j-c));
						if(gameB.playfield[r+i][c+j].demand <  strength){
							gameB.playfield[r+i][c+j].demand = 0;
						}
						else{
							gameB.playfield[r+i][c+j].demand -= strength;
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
	gameB.nextCrystal.name = name.substring(0,name.length-1);
	gameB.nextCrystal.level = level;
}

function checkForRune(){
	
}