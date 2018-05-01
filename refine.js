var refine = {
	playfield :[],
	rowMax: 5,
	colMax: 5,
	row: 5,
	col: 5,
	maxRoled: 100,
	maxLevel: 100, //TODO make it work maybe?
	nextStone:{name: "none", level : 0},
	probExpo: 1.0,
	mult: 1.0,
}
var chainR = [];
//Maybe every Upgrade should let you connect with (Level of Upgrade) many fields?;
//Maybe Mouse over table should show next stone?
function initPlayfieldR(){
	//NIU
	for(var i = 0; i < refine.row; i++){
		refine.playfield[i] = [];
		for(var j = 0; j < refine.col; j++){
			if(refine.playfield[i][j] == undefined)
			refine.playfield[i][j] = {type : {color : "white", level: " "}, upgrade: 0};
		}
	}
}
function loadRefine(){
	buildTableRefine();
	buildNextCrystal();//TODO
	if (refine.playfield[0] !== undefined){
		for(var i =0; i < refine.row; i++){
			for(var j = 0; j < refine.col; j++){
				updateFieldR(i,j);
			}
		}
		document.getElementById("nextCrystal").innerHTML = refine.nextStone.level;
		document.getElementById("nextCrystal").style.backgroundColor = refine.nextStone.name;
	}
	else{
		newRefine();
	}
}
function newRefine(){
	clearBoardR();
	buildTableRefine();
	buildNextCrystal();
	for(var i = 0; i < refine.row; i++){
		refine.playfield[i] = [];
		for(var j = 0; j < refine.col; j++){
			refine.playfield[i][j] = {type : {color : "white", level: " "}, upgrade: 0};
			updateFieldR(i,j);
		}
	}
	nextStone();
}
function buildTableRefine(){
	buildTableBalanced("refineT",refine.row,refine.col);
	for(var i = 0; i < refine.row; i++){
		for(var j = 0; j < refine.col; j++){
			refineTableCellEvents(i,j);
		}
	}
}

function clearBoardR(){
	refineDistortion();
	if(refine.playfield.length != 0){
		for(var i = 0; i < refine.row; i++){
			for(var j = 0; j < refine.col; j++){
				addStoneToRessources(refine.playfield[i][j]);
				refine.playfield[i][j] = {type : {color : "white", level: " "}, upgrade: 0};
				updateFieldR(i,j);
			}
		}
	}
}
function refineDistortion(){
	/*if(refine.playfield[0] == undefined){
		return false;
	}
	var temp = [];
	var amount =[];
	var t = 0;
	for(var i = 0; i < refine.row; i++){
		for(var j = 0; j < refine.col; j++){
			if(refine.playfield[i][j].type.color != "white"){
				var s = refine.playfield[i][j].type.color + " "+ refine.playfield[i][j].type.level;
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
	cellAt("refineT",r,c).style.backgroundColor = refine.playfield[r][c].type.color;
	cellAt("refineT",r,c).innerHTML = refine.playfield[r][c].type.level;
}
function addStoneToRessources(stone){
	if(stone.type.color !== "white"){
		var color = stone.type.color;
		if(stone.type.level == " "){			
			color += "G";
			
			resources[color].amount+=refine.mult;
		}
		else{
			color +="R"
			if(resources[color].amount[stone.type.level-1] == undefined){
				resources[color].amount[stone.type.level-1] = 0;
			}
			resources[color].amount[stone.type.level-1]+= refine.mult;
		}
	}
	updateResources();
}
function nextStone(){ //just does some magic don't try to understand it, its shameful :o
	var prob = [];
	var i = 0;
	var max = 0;
	
	for(var res	in resources["puzzles"]["essences"]){
		var obj = resources["puzzles"]["essences"][res];
		var arr = [max];
		for(var j = 0; j < obj.amount.length; j++){
			if(obj.amount[j] >= refine.mult){
				max += Math.floor(Math.pow(Math.floor(obj.amount[j]),refine.probExpo));
			}
			arr[j] = max;
		}
		prob[i] = {amount : arr, type : "essence", "color" : res};			
		i++;
	}
	for(var res	in resources["puzzles"]["crystals"]){
		var obj = resources["puzzles"]["crystals"][res];
		var arr = [max];
		for(var j = 0; j < obj.amount.length; j++){
			if(obj.amount[j] >= refine.mult){
				max += Math.floor(Math.pow(Math.floor(obj.amount[j]),refine.probExpo));
			}
			arr[j] = max;
		}
		prob[i] = {amount : arr, type : "crystals", "color" : res};			
		i++;
	}
	console.log(prob);
	if(max != 0){
		var rn = Math.random()*max;
		var color = prob[0].color;
		var level = 0;
		for(var i = prob.length-1; i >= 0; i--){
			if(rn > prob[i].amount[prob[i].amount.length-1]){
				color = [prob[i+1].type,prob[i+1].color] ;
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
		}
		updateNextStone(color, level);
	return;
		
	}
	else{
		updateNextStone("none", "Empty");
	}
}
function updateNextStone(name, level){
	document.getElementById("nextCrystal").innerHTML = level;
	document.getElementById("nextCrystal").style.backgroundColor = name;
	refine.nextStone.name = name;
	refine.nextStone.level = level;
	
}
function placeStone(cell){
	if(refine.nextStone.name != "none"){
		if(cell.style.backgroundColor == "white"){
			var arr = getCellWithId(cell.id);
			var r = arr[1];
			var c = arr[2];
			refine.playfield[r][c].type.color = refine.nextStone.name;
			refine.playfield[r][c].type.level = refine.nextStone.level;	
			updateFieldR(r,c);
			var temp = refine.nextStone.name;
			if(refine.nextStone.level == 0){
				console.log(["puzzles","essences",temp,0,(-refine.mult)]);
				addResource(["puzzles","essences",temp],0,(-refine.mult));
			}
			else{
				console.log(["puzzles","crystals",temp,refine.nextStone.level-1,(-refine.mult)])
				addResource(["puzzles","crystals",temp],refine.nextStone.level-1,(-refine.mult));
			}
			checkStones(r,c);
			nextStone();
		}
	}
	else{
		nextStone();
	}
}
function checkStones(r,c){
	buildChainRefine(r,c);
	if(chainR.length >= 3){
		if(refine.playfield[r][c].type.level == 0){
			var color = refine.playfield[r][c].type.color + "G";
			resources[color].amount += (chainR.length - 3)*refine.mult; 
		}
		else{
			var color = refine.playfield[r][c].type.color + "R";
			var level = refine.playfield[r][c].type.level - 1;
			if(resources[color].amount[level] == undefined || resources[color].amount[level] == NaN){
				for(var i = 0; i <= level; i++){					
					if(resources[color].amount[i] == undefined || resources[color].amount[i] == NaN){
						resources[color].amount[i] = 0;
					}
				}
			}
			resources[color].amount[level] += (chainR.length - 3)*refine.mult;
		}
		updateResources();
		colorChainR();
		chainR = [];
		checkStones(r,c);
	}
	chainR = [];
}
function buildChainRefine(r,c){
	chainR.push(r + " " + c);
	console.log([r,c]);
	if(r > 0){
		if((chainR.indexOf((r-1) + " " + c) == -1 )&& (refine.playfield[(r-1)][c].type.color == refine.playfield[r][c].type.color) && (refine.playfield[(r-1)][c].type.level == refine.playfield[r][c].type.level) ){
			buildChainRefine(r-1,c);
		}
	}
	if(r < refine.row-1){
		if((chainR.indexOf((r+1) + " " + c) == -1 )&& (refine.playfield[(r+1)][c].type.color == refine.playfield[r][c].type.color)&& (refine.playfield[(r+1)][c].type.level == refine.playfield[r][c].type.level)){
			buildChainRefine(r+1,c);
		}
	}
	if(c > 0){
		if((chainR.indexOf(r + " " + (c-1)) == -1 )&& (refine.playfield[r][(c-1)].type.color == refine.playfield[r][c].type.color)&& (refine.playfield[r][(c-1)].type.level == refine.playfield[r][c].type.level)){
			buildChainRefine(r,c-1);
		}
	}
	if(c < refine.col-1){
		if((chainR.indexOf(r + " " + (c+1)) == -1 )&&(refine.playfield[r][(c+1)].type.color == refine.playfield[r][c].type.color)&&(refine.playfield[r][(c+1)].type.level == refine.playfield[r][c].type.level)){
			buildChainRefine(r,c+1);
		}
	}
	//TODO upgrades
}
function colorChainR(){
	var s = chainR[0];
	var x = s.indexOf(" ");
	var r = parseInt(s.substring(0,x));
	var c = parseInt(s.substring(x+1));
	refine.playfield[r][c].type.level += 1;
	updateFieldR(r,c);
	for(var i = 1; i < chainR.length; i++){
		s = chainR[i];
		x = s.indexOf(" ");
		r = parseInt(s.substring(0,x));
		c = parseInt(s.substring(x+1));
		refine.playfield[r][c].type = {color : "white", level: " "};
		updateFieldR(r,c);
	}
}

function buildNextCrystal(){
//TODO	
}