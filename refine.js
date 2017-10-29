var gameR = {
	playfield :[],
	rRowMax: 3,
	rColMax: 3,
	rRow: 3,
	rCol: 3,
	maxRoled: 1,
	maxLevel: 100, //TODO make it work
	nextStone:{name: "none", level : 0}
}
var chainR = [];
function initPlayfieldR(){
	//NIU
	for(var i = 0; i < gameR.gRow; i++){
		gameR.playfield[i] = [];
		for(var j = 0; j < gameR.gCol; j++){
			if(gameR.playfield[i][j] == undefined)
			gameR.playfield[i][j] = {type : {color : "white", level: " "}, upgrade: 0};
		}
	}
}
function loadGameR(){
	buildTable("refineT",gameR.rRow,gameR.rCol);
	buildTable("refineItemsT",1,1);
	if (gameR.playfield[0] !== undefined){
		for(var i =0; i < gameR.rRow; i++){
			for(var j = 0; j < gameR.rCol; j++){
				updateFieldR(i,j);
			}
		}
		document.getElementById("refineItemsT").rows[0].cells[0].innerHTML = gameR.nextStone.level;
		document.getElementById("refineItemsT").rows[0].cells[0].style.backgroundColor = gameR.nextStone.name;
	}
	else{
		newGameG();
	}
}
function newGameR(){
	clearBoard();
	buildTable("refineT",gameR.rRow,gameR.rCol);
	buildTable("refineItemsT",1,1);
	for(var i = 0; i < gameR.rRow; i++){
		gameR.playfield[i] = [];
		for(var j = 0; j < gameR.rCol; j++){
			gameR.playfield[i][j] = {type : {color : "white", level: " "}, upgrade: 0};
			updateFieldR(i,j);
		}
	}
	nextStone();
}
function clearBoard(){
	refineDistortion();
	if(gameR.playfield.length != 0){
		for(var i = 0; i < gameR.rRow; i++){
			for(var j = 0; j < gameR.rCol; j++){
				addStoneToRessources(gameR.playfield[i][j]);
				gameR.playfield[i][j] = {type : {color : "white", level: " "}, upgrade: 0};
				updateFieldR(i,j);
			}
		}
	}
}
function refineDistortion(){
	
}
function updateFieldR(r,c){
	document.getElementById("refineT").rows[r].cells[c].style.backgroundColor = gameR.playfield[r][c].type.color;
	document.getElementById("refineT").rows[r].cells[c].innerHTML = gameR.playfield[r][c].type.level;
	document.getElementById("refineT").rows[r].cells[c].onclick = function(){placeStone(this)};
}
function addStoneToRessources(stone){
	if(stone.type.color !== "white"){
		var color = stone.type.color;
		if(stone.type.level == " "){			
			color += "G";
			
			resources[color].amount++;
		}
		else{
			color +="R"
			if(resources[color].amount[stone.type.level-1] == undefined){
				resources[color].amount[stone.type.level-1] = 0;
			}
			resources[color].amount[stone.type.level-1]++;
		}
	}
	updateResources();
}
function nextStone(){ //just does some magic don't try to understand it, its shameful :o
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
		}
		else {
			max += Math.floor(obj.amount);
			prob[i] = {amount: Math.floor(max), name: res};
			
		}
		i++;
	}
	if(max == 0){
		return false;
	}
	var rn = Math.random()*max;
	var name = prob[0].name;
	var level = 0;
	for(var i = prob.length-1; i >= 0; i--){
		if(prob[i].amount.constructor === Array){
			if(rn > prob[i].amount[prob[i].amount.length-1]){
				if(prob[i+1].amount.constructor === Array){
					name = prob[i+1].name;
					level = 1;
					for(var j = prob[i].amount.length-2; j >= 0; j--){
						if(rn > prob[i+1].amount[j]){
							i = 0;
							level = j+2;
						}
					}
					i = 0;
				}
				else{
					name = prob[i+1].name;
					i = 0;
				}
			}
		}
		else{
			if(rn > prob[i].amount){
				if(prob[i+1].amount.constructor === Array){
					name = prob[i+1].name;
					level = 1;
					for(var j = prob[i+1].amount.length-1; j >= 0; j--){
						if(rn > prob[i+1].amount[j]){
							i = 0;
							level = j+2;
						}
					}
					i = 0;
				}
				else{
					name = prob[i+1].name;
					i = 0;
				}
			}
		}
	}
	updateNextStone(name, level);
}
function updateNextStone(name, level){
	document.getElementById("refineItemsT").rows[0].cells[0].innerHTML = level;
	document.getElementById("refineItemsT").rows[0].cells[0].style.backgroundColor = name.substring(0,name.length-1);
	gameR.nextStone.name = name.substring(0,name.length-1);
	gameR.nextStone.level = level;
	
}
function placeStone(cell){
	if(gameR.nextStone.name != "none"){
		if(cell.style.backgroundColor == "white"){
			var r = cell.parentNode.rowIndex;
			var c = cell.cellIndex;
			gameR.playfield[r][c].type.color = gameR.nextStone.name;
			gameR.playfield[r][c].type.level = gameR.nextStone.level;	
			updateFieldR(r,c);
			if(gameR.nextStone.level == 0){
				var temp = gameR.nextStone.name+"G";
				resources[temp].amount--;
			}
			else{
				var temp = gameR.nextStone.name+"R";
				resources[temp].amount[gameR.nextStone.level-1]--;
			}
			updateResources();
			checkStones(r,c);
			nextStone();
		}
	} 
	else{
		nextStone();
	}
}
function checkStones(r,c){
	buildChainR(r,c);
	if(chainR.length >= 3){
		if(gameR.playfield[r][c].type.level == 0){
			var color = gameR.playfield[r][c].type.color + "G";
			resources[color].amount += (chainR.length - 3); 
		}
		else{
			var color = gameR.playfield[r][c].type.color + "R";
			var level = gameR.playfield[r][c].type.level - 1;
			if(resources[color].amount[level] == undefined || resources[color].amount[level] == NaN){
				for(var i = 0; i <= level; i++){					
					if(resources[color].amount[i] == undefined || resources[color].amount[i] == NaN){
						resources[color].amount[i] = 0;
					}
				}
			}
			resources[color].amount[level] += (chainR.length - 3);
		}
		updateResources();
		colorChainR();
		chainR = [];
		checkStones(r,c);
	}
	chainR = [];
}
function buildChainR(r,c){
	chainR.push(r + " " + c)
	if(r > 0){
		if((chainR.indexOf((r-1) + " " + c) == -1 )&& (gameR.playfield[(r-1)][c].type.color == gameR.playfield[r][c].type.color) && (gameR.playfield[(r-1)][c].type.level == gameR.playfield[r][c].type.level) ){
			buildChainR(r-1,c);
		}
	}
	if(r < gameR.rRow-1){
		if((chainR.indexOf((r+1) + " " + c) == -1 )&& (gameR.playfield[(r+1)][c].type.color == gameR.playfield[r][c].type.color)&& (gameR.playfield[(r+1)][c].type.level == gameR.playfield[r][c].type.level)){
			buildChainR(r+1,c);
		}
	}
	if(c > 0){
		if((chainR.indexOf(r + " " + (c-1)) == -1 )&& (gameR.playfield[r][(c-1)].type.color == gameR.playfield[r][c].type.color)&& (gameR.playfield[r][(c-1)].type.level == gameR.playfield[r][c].type.level)){
			buildChainR(r,c-1);
		}
	}
	if(c < gameR.rCol-1){
		if((chainR.indexOf(r + " " + (c+1)) == -1 )&&(gameR.playfield[r][(c+1)].type.color == gameR.playfield[r][c].type.color)&&(gameR.playfield[r][(c+1)].type.level == gameR.playfield[r][c].type.level)){
			buildChainR(r,c+1);
		}
	}
	//TODO upgrades
}
function colorChainR(){
	var s = chainR[0];
	var x = s.indexOf(" ");
	var r = parseInt(s.substring(0,x));
	var c = parseInt(s.substring(x+1));
	gameR.playfield[r][c].type.level += 1;
	updateFieldR(r,c);
	for(var i = 1; i < chainR.length; i++){
		s = chainR[i];
		x = s.indexOf(" ");
		r = parseInt(s.substring(0,x));
		c = parseInt(s.substring(x+1));
		gameR.playfield[r][c].type = {color : "white", level: " "};
		updateFieldR(r,c);
	}
}