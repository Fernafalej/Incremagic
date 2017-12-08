var gameR = {
	playfield :[],
	rowMax: 5,
	colMax: 5,
	row: 5,
	col: 5,
	maxRoled: 100,
	maxLevel: 100, //TODO make it work maybe?
	nextStone:{name: "none", level : 0},
	probExpo: 2.0,
	mult: 2.0,
}
var chainR = [];
//Maybe every Upgrade should let you connect with (Level of Upgrade) many fields?;
//Maybe Mouse over table should show next stone?
function initPlayfieldR(){
	//NIU
	for(var i = 0; i < gameR.row; i++){
		gameR.playfield[i] = [];
		for(var j = 0; j < gameR.col; j++){
			if(gameR.playfield[i][j] == undefined)
			gameR.playfield[i][j] = {type : {color : "white", level: " "}, upgrade: 0};
		}
	}
}
function loadGameR(){
	buildTable("refineT",gameR.row,gameR.col);
	buildTable("refineItemsT",1,1);
	if (gameR.playfield[0] !== undefined){
		for(var i =0; i < gameR.row; i++){
			for(var j = 0; j < gameR.col; j++){
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
	clearBoardR();
	buildTable("refineT",gameR.row,gameR.col);
	buildTable("refineItemsT",1,1);
	for(var i = 0; i < gameR.row; i++){
		gameR.playfield[i] = [];
		for(var j = 0; j < gameR.col; j++){
			gameR.playfield[i][j] = {type : {color : "white", level: " "}, upgrade: 0};
			updateFieldR(i,j);
		}
	}
	nextStone();
}
function clearBoardR(){
	refineDistortion();
	if(gameR.playfield.length != 0){
		for(var i = 0; i < gameR.row; i++){
			for(var j = 0; j < gameR.col; j++){
				addStoneToRessources(gameR.playfield[i][j]);
				gameR.playfield[i][j] = {type : {color : "white", level: " "}, upgrade: 0};
				updateFieldR(i,j);
			}
		}
	}
}
function refineDistortion(){
	/*if(gameR.playfield[0] == undefined){
		return false;
	}
	var temp = [];
	var amount =[];
	var t = 0;
	for(var i = 0; i < gameR.row; i++){
		for(var j = 0; j < gameR.col; j++){
			if(gameR.playfield[i][j].type.color != "white"){
				var s = gameR.playfield[i][j].type.color + " "+ gameR.playfield[i][j].type.level;
				if(temp.indexOf(s) != -1){
					amount[temp.indexOf(s)]++;	
				}
				else{
					amount[t] = 1;
					temp[t] = s;
					t++;
				}
			}
		}
	}
	for(var i = 0; i < temp.length; i++){
		if(amount[i] > 2){
			var color = temp[i].indexOf(" ");
			var level = parseInt(temp[i].substring(color+1));
			color = temp[i].substring(0,color);
			if(distortion[color].amount[level] == undefined){
				distortion.refine[color].amount[level-1] = 0;
			}
			distortion.refine[color].amount[level-1] += amount[i] - 2;
		}
	}*/
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
			
			resources[color].amount+=gameR.mult;
		}
		else{
			color +="R"
			if(resources[color].amount[stone.type.level-1] == undefined){
				resources[color].amount[stone.type.level-1] = 0;
			}
			resources[color].amount[stone.type.level-1]+= gameR.mult;
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
				if(obj.amount[j] >= gameR.mult){
					max += Math.floor(Math.pow(Math.floor(obj.amount[j]),gameR.probExpo));
				}
				arr[j] = max;
			}
			prob[i] = {amount : arr, name : res};			
		}
		else {
			if(obj.amount >= gameR.mult){
				max += Math.floor(Math.pow(Math.floor(obj.amount),gameR.probExpo));
			}
			prob[i] = {amount: max, name: res};
			
		}
		i++;
	}
	if(max != 0){
		var rn = Math.random()*max;
		var name = prob[0].name;
		var level = 0;
		for(var i = prob.length-1; i >= 0; i--){
			if(prob[i].amount.constructor === Array){
				if(rn > prob[i].amount[prob[i].amount.length-1]){
					if(prob[i+1].amount.constructor === Array){
						name = prob[i+1].name;
						level = 1;
						for(var j = prob[i+1].amount.length-1; j >= 0; j--){
							if(rn > prob[i+1].amount[j]){
								i = -1;
								level = j+2;
								j = -1;
							}
						}
						i = -1;
					}
					else{
						name = prob[i+1].name;
						i = -1;
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
								i = -1;
								level = j+2;
								j = -1;
							}
						}
						i = -1;
					}
					else{
						name = prob[i+1].name;
						i = -1;
					}
				}
			}
		}
		updateNextStone(name, level);
		return;
	}
	else{
		updateNextStone("none ", "Empty");
	}
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
				resources[temp].amount-= gameR.mult;
			}
			else{
				var temp = gameR.nextStone.name+"R";
				resources[temp].amount[gameR.nextStone.level-1]-= gameR.mult;
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
			resources[color].amount += (chainR.length - 3)*gameR.mult; 
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
			resources[color].amount[level] += (chainR.length - 3)*gameR.mult;
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
	if(r < gameR.row-1){
		if((chainR.indexOf((r+1) + " " + c) == -1 )&& (gameR.playfield[(r+1)][c].type.color == gameR.playfield[r][c].type.color)&& (gameR.playfield[(r+1)][c].type.level == gameR.playfield[r][c].type.level)){
			buildChainR(r+1,c);
		}
	}
	if(c > 0){
		if((chainR.indexOf(r + " " + (c-1)) == -1 )&& (gameR.playfield[r][(c-1)].type.color == gameR.playfield[r][c].type.color)&& (gameR.playfield[r][(c-1)].type.level == gameR.playfield[r][c].type.level)){
			buildChainR(r,c-1);
		}
	}
	if(c < gameR.col-1){
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