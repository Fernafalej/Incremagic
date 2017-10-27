var gameR = {
	playfield :[],
	rRowMax: 3,
	rColMax: 3,
	rRow: 3,
	rCol: 3,
	maxRoled: 1,
}
function initPlayfieldR(){
	for(var i = 0; i < gameR.gRow; i++){
		gameR.playfield[i] = [];
		for(var j = 0; j < gameR.gCol; j++){
			console.log(gameR.playfield[i][j]);
			if(gameR.playfield[i][j] == undefined)
			gameR.playfield[i][j] = {type : {color : "white", level: " "}, upgrade: 0};
		}
	}
}
function loadGameR(){
	//TODO
}
function newGameR(){
	clearBoard();
	buildTable("refineT",gameR.rRow,gameR.rCol);
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
	console.log(gameR);
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
			resources[color].amount[stone.type.level]++;
		}
	}
}
function nextStone(){
	
}
