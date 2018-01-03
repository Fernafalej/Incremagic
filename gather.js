var gather = {
	colors: ["green","blue","red","white","aqua","purple","yellow","black"],
	probs: [35,30,25,10,0,0,0,0],//probability to gain green,blue,red,white,orange,purple,yellow,black
	probRange: [35,65,90,100,100,100,100,100],
	rowMax: 4,
	colMax: 4,
	row: 4,
	col: 4,
	maxChainLength: 3,
	freestyle: false,
	moves: 0,
	movesSincePrestige: 0,
	movesTotal: 0,
	gamesSincePrestige: 0,
	gamesTotal: 0,
	playfield: [],
	mult : 1.0,
}

var	gatherMouse = false;
var	chainG = [];

function initPlayfieldGather(){
	for(var i = 0; i < gather.row; i++){
		gather.playfield[i] = [];
		for(var j = 0; j < gather.col; j++){
			if(gather.playfield[i][j] == undefined)
			gather.playfield[i][j] = {color : "red", upgrade : 
				{mult : 1,
				}
			}
		}
	}
}

function loadGather(){
	buildTableBalanced("gatherT",gather.row,gather.col);
	if (gather.playfield[0] !== undefined){
		for(var i = 0; i < gather.row; i++){
			for(var j = 0; j < gather.col; j++){
				gatherTableCellEvents(i,j);
				document.getElementById("gatherT").childNodes[i].childNodes[j].style.backgroundColor = referredColor(gather.playfield[i][j].color);
			}
		}
	}
	else{
		newGather();
	}
}

function changeProb(colorNumber, probability){
	oldP = gather.probs[colorNumber];
	change = probability - oldP;
	if(change < 0){
		return false;
	}
	for(var i = colorNumber; i < gather.probs.length; i++){
		gather.probRange[i] += change;
	}
	return true;
}
function changeColor(r,c){
	var temp = Math.random()*gather.probRange[gather.probRange.length-1];	
	var color =  gather.colors[0];
	for(var i = gather.probRange.length-1; i >= 0; i--){
		if(temp > gather.probRange[i]){
			color = gather.colors[i+1];
			i = 0;
		}
	}
	cellAt("gatherT",r,c).style.backgroundColor = referredColor(color);
	gather.playfield[r][c].color = color;
	
}
function changeColorOfCell(cell){
	var arr = getCellWithId(cell.id);
	changeColor(arr[1], arr[2]);
}

function newGather(){
	calcDistortionGather();
	buildTableBalanced("gatherT",gather.row,gather.col);
	initPlayfieldGather();
	addExpierienceGather();
	gather.moves = 0;
	gather.gamesSincePrestige++;
	gather.gamesTotal++;
	for(var i = 0; i < gather.row; i++){
		for(var j = 0; j < gather.col; j++){
			gatherTableCellEvents(i,j);
			changeColor(i,j);
		}
	}
}

function calcDistortionGather(){
	for (var i = 0; i < gather.playfield.length; i++){
		for(var j = 0; j < gather.playfield[i].length; j++){
			var distorted = 0;
			var color = gather.playfield[i][j].color;
			if(color != "white" && color != "black" ){
				if(i != 0){
					if(gather.playfield[i-1][j].color == color){
						distorted++;
					}
					else{
						distorted--;
					}
				}
				if(i != gather.playfield.length-1){
					if(gather.playfield[i+1][j].color == color){
						distorted++;
					}
					else{
						distorted--;
					}
				}
				if(j != 0){
					if(gather.playfield[i][j-1].color == color){
						distorted++;
					}
					else{
						distorted--;
					}
				}
				if(j != gather.playfield[i].length-1){
					if(gather.playfield[i][j+1].color == color){
						distorted++;
					}
					else{
						distorted--;
					}
				}
				if(distorted > 0){
					//TODO
					//distortion.gather[color].amount += distorted;
				}
			}
		}
	}
}
function buildChainGather(r,c){
	if(gatherMouse){
		if(chainG.indexOf(r+ " "+c) == -1){
			chainG.push(r+ " "+c);
			markCell(r,c);			
		}
	}
}
function checkChainGather(){
	var b = false;
	if(isChainGatherConnected() && chainG.length <= gather.maxChainLength && isChainGBalanced()){
		b = true;
		var joker = 0;
		for(var i = 0; i < chainG.length; i++){
			if(chainGInPlayfield(chainG[i]).color == "white"){
				joker++;
			}
		}
		joker =  chainG.length/(chainG.length-joker);
		for(var i = 0; i < chainG.length; i++){
			var field = chainGInPlayfield(chainG[i]);
			if(field.color != "black" && field.color != "white"){
				var s = field.color ;					
				var mult = field["upgrade"]["mult"];
				addResource(["puzzles","essences",s],0,joker*mult);
			}
		}
		gather.moves++;
		gather.movesSincePrestige++;
		gather.movesSinceReset++;
	}
	dislodgeChainGather(b);
}

function chainGInPlayfield(chainGCell){
	var r;
	var c;
	var x = chainGCell.indexOf(" ");
	r = parseInt(chainGCell.substring(0,x));
	c = parseInt(chainGCell.substring(x+1));
	return gather.playfield[r][c];
}
function isChainGatherConnected(){
	//TODO its a bug not a feature low prio
	return true;
}
function isChainGBalanced(){
	if(!gather.freestyle && (chainG.length % 3 != 0)){
		return false;
	}
	var green = 0.0;
	var red = 0.0;
	var blue = 0.0;
	var joker = 0.0;
	for(var i = 0; i < chainG.length; i++){
		if(chainGInPlayfield(chainG[i]).color == "green"){
			green++;
		}
		else if(chainGInPlayfield(chainG[i]).color == "red"){
			red++;
		}
		else if(chainGInPlayfield(chainG[i]).color == "blue"){
			blue++;
		}
		else if(chainGInPlayfield(chainG[i]).color == "aqua"){
			green += 0.5;
			blue += 0.5;
		}
		else if(chainGInPlayfield(chainG[i]).color == "purple"){
			red += 0.5;
			blue += 0.5;
		}
		else if(chainGInPlayfield(chainG[i]).color == "yellow"){
			green += 0.5;
			red += 0.5;
		}
		else if(chainGInPlayfield(chainG[i]).color =="white"){
			joker += 1;
		}
		else if(chainGInPlayfield(chainG[i]).color == "black"){
			joker +=1;
		}		
	}
	if(green <= chainG.length/3 && blue <= chainG.length/3 && red <= chainG.length/3){
		return true;
	}
	else{
		return false;
	}
}
function getCell(s){
	var r;
	var c;
	var x = s.indexOf(" ");
	r = parseInt(s.substring(0,x));
	c = parseInt(s.substring(x+1));
	return cellAt("gatherT",r,c);
}
function markCell(r,c){
	cellAt("gatherT",r,c).style.opacity = "0.7";
}
function unmarkCell(cell){
	cell.style.opacity = "1.0";
}
function dislodgeChainGather(bool){
	while (chainG.length > 0){
		var temp = getCell(chainG[chainG.length-1]);
		unmarkCell(temp);
		if(bool){
			changeColorOfCell(temp);
		}
		chainG.pop();
	}
}
function addExpierienceGather(){
	var s = Math.pow(gather.moves,1.25);
	var b = 1;
	if(gather.gamesSincePrestige > 0){
		b = Math.pow(gather.gamesSincePrestige,-0.5);
	}
	var c = 0;
	if(gather.movesSincePrestige*gather.moves > 0){
		c = Math.log(gather.movesSincePrestige*gather.moves);
	}
	experience.gather = s/b+c;
}