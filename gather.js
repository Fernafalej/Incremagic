var gameG = {
	colors: ["green","blue","red","white","aqua","purple","yellow","black"],
	probs: [35,30,25,10,0,0,0,0],//probability to gain green,blue,red,white,orange,purple,yellow,black
	probRange: [35,65,90,100,100,100,100,100],
	rowMax: 4,
	cowMax: 4,
	row: 4,
	col: 4,
	maxChainLength: 6,
	freestyle: false,
	moves: 0,
	movesSinceReset: 0,
	playfield: []
}
var	gMouse= false;
var	chainG= [];

function initPlayfieldG(){
	for(var i = 0; i < gameG.row; i++){
		gameG.playfield[i] = [];
		for(var j = 0; j < gameG.col; j++){
			if(gameG.playfield[i][j] == undefined)
			gameG.playfield[i][j] = {color : "red", upgrade : 1}
		}
	}
}
function loadGameG(){
	buildTable("gatherT",gameG.row,gameG.col);
	document.getElementById("gatherT").onmousedown = function() {gMouseDown()};
	document.getElementById("gatherT").onmouseup = function() {gMouseUp()};
	document.getElementById("gatherT").onmouseleave = function() {gMouseUp()};
	if (gameG.playfield[0] !== undefined){
		for(var i =0; i < gameG.row; i++){
			for(var j = 0; j < gameG.col; j++){
				document.getElementById("gatherT").rows[i].cells[j].style.backgroundColor = gameG.playfield[i][j].color;
				document.getElementById("gatherT").rows[i].cells[j].onmouseover = function(){
					buildchainG(this.parentNode.rowIndex,this.cellIndex)
				};
			
				document.getElementById("gatherT").rows[i].cells[j].onmouseleave = function(){
					buildchainG(this.parentNode.rowIndex,this.cellIndex)
				};
			}
		}
	}
	else{
		newGameG();
	}
}
function changeProb(colorNumber, probability){
	oldP = gameG.probs[colorNumber];
	change = probability - oldP;
	if(change < 0){
		return false;
	}
	for(var i = colorNumber; i < gameG.probs.length; i++){
		gameG.probRange[i] += change;
	}
	return true;
}
function changeColor(r,c){
	var temp = Math.random()*gameG.probRange[gameG.probRange.length-1];	
	var color =  gameG.colors[0];
	for(var i = gameG.probRange.length-1; i >= 0; i--){
		if(temp > gameG.probRange[i]){
			color = gameG.colors[i+1];
			i = 0;
		}
	}
	document.getElementById("gatherT").rows[r].cells[c].style.backgroundColor = color;
	gameG.playfield[r][c].color = color;
	
}
function changeColorOfCell(cell){
	return changeColor(cell.parentNode.rowIndex, cell.cellIndex);
}
function newGameG(){
	gatherDistortion();
	buildTable("gatherT",gameG.row,gameG.col);
	initPlayfieldG();
	gameG.moves = 0;
	document.getElementById("gatherT").onmousedown = function() {gMouseDown()};
	document.getElementById("gatherT").onmouseup = function() {gMouseUp()};
	document.getElementById("gatherT").onmouseleave = function() {gMouseUp()};
	for(var i = 0; i < gameG.row; i++){
		for(var j = 0; j < gameG.col; j++){
			document.getElementById("gatherT").rows[i].cells[j].onmouseover = function(){
				buildchainG(this.parentNode.rowIndex,this.cellIndex)
			};
			
			document.getElementById("gatherT").rows[i].cells[j].onmouseleave = function(){
				buildchainG(this.parentNode.rowIndex,this.cellIndex)
			};
			changeColor(i,j);
		}
	}
}
function gatherDistortion(){
	for (var i = 0; i < gameG.playfield.length; i++){
		for(var j = 0; j < gameG.playfield[i].length; j++){
			var distorted = 0;
			var color = gameG.playfield[i][j].color;
			if(color != "white" && color != "black" ){
				if(i != 0){
					if(gameG.playfield[i-1][j].color == color){
						distorted++;
					}
					else{
						distorted--;
					}
				}
				if(i != gameG.playfield.length-1){
					if(gameG.playfield[i+1][j].color == color){
						distorted++;
					}
					else{
						distorted--;
					}
				}
				if(j != 0){
					if(gameG.playfield[i][j-1].color == color){
						distorted++;
					}
					else{
						distorted--;
					}
				}
				if(j != gameG.playfield[i].length-1){
					if(gameG.playfield[i][j+1].color == color){
						distorted++;
					}
					else{
						distorted--;
					}
				}
				if(distorted > 0){
					color = color +"G";
					distortion[color].amount += distorted;
				}
			}
		}
	}
}
function gMouseDown(){
	gMouse = true;
}
function gMouseUp(){
	gMouse = false;
	checkchainG();
}
function buildchainG(r,c){
	if(gMouse){
		if(chainG.indexOf(r+ " "+c) == -1){
			chainG.push(r+ " "+c);
			markCell(r,c);			
		}
	}
}
function checkchainG(){
	var b = false;
	if(isChainGConnected() && chainG.length <= gameG.maxChainLength && isChainGBalanced()){
		b = true;
		var joker = 0;
		for(var i = 0; i < chainG.length; i++){
			if(getCell(chainG[i]).style.backgroundColor == "white"){
				joker++;
			}
		}
		joker =  chainG.length/(chainG.length-joker);
		for(var i = 0; i < chainG.length; i++){
			if(getCell(chainG[i]).style.backgroundColor != "black" && getCell(chainG[i]).style.backgroundColor != "white"){
				var s = getCell(chainG[i]).style.backgroundColor +"G";					
				var mult = chainGInPlayfield((chainG[i]))["upgrade"];
				resources[s].amount += joker*mult;
			}
		}
		gameG.moves++;
		gameG.movesSinceReset++;
	}
	dislodgechainG(b);
	updateResources();	
}
function chainGInPlayfield(chainGCell){
	var r;
	var c;
	var x = chainGCell.indexOf(" ");
	r = parseInt(chainGCell.substring(0,x));
	c = parseInt(chainGCell.substring(x+1));
	return gameG.playfield[r][c];
}
function isChainGConnected(){
	/*var bool = [];
		bool[0] = true;
	var changed = false;
	for(var i = 1; i < chainG.length; i++){
		bool[i] = false;
	}
	for(var i = 0; i < chainG.length; i++){
		
	}*/
	
	//TODO its a bug not a feature low prio
	return true;
}
function isChainGBalanced(){
	if(!gameG.freestyle && (chainG.length % 3 != 0)){
		return false;
	}
	var green = 0.0;
	var red = 0.0;
	var blue = 0.0;
	var joker = 0.0;
	for(var i = 0; i < chainG.length; i++){
		if(getCell(chainG[i]).style.backgroundColor == "green"){
			green++;
		}
		else if(getCell(chainG[i]).style.backgroundColor == "red"){
			red++;
		}
		else if(getCell(chainG[i]).style.backgroundColor == "blue"){
			blue++;
		}
		else if(getCell(chainG[i]).style.backgroundColor == "aqua"){
			green += 0.5;
			blue += 0.5;
		}
		else if(getCell(chainG[i]).style.backgroundColor == "purple"){
			red += 0.5;
			blue += 0.5;
		}
		else if(getCell(chainG[i]).style.backgroundColor == "yellow"){
			green += 0.5;
			red += 0.5;
		}
		else if(getCell(chainG[i]).style.backgroundColor == "white"){
			joker += 1;
		}
		else if(getCell(chainG[i]).style.backgroundColor == "black"){
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
	return document.getElementById("gatherT").rows[r].cells[c];
}
function markCell(r,c){
	document.getElementById("gatherT").rows[r].cells[c].innerHTML = "x";
}
function unmarkCell(cell){
	cell.innerHTML = "";
}
function dislodgechainG(bool){
	while (chainG.length > 0){
		var temp = getCell(chainG[chainG.length-1]);
		unmarkCell(temp);
		if(bool){
			changeColorOfCell(temp);
		}
		chainG.pop();
	}
}
