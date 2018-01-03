function loadEventListeners(){
	loadShowable();
	loadHideable();
	gatherTableEvents();
}

function loadShowable(){
	var showables = document.getElementsByClassName("showable");
	for(var i = 0; i < showables.length; i++){
		var elem = showables[i];
		elem.addEventListener("click", function(){
			var str = this.id;
			str = str.slice((str.indexOf("show")+4),str.length);
			showId(str);
		});
	}
}

function loadHideable(){
	var hideables = document.getElementsByClassName("hideable");
	for(var i = 0; i < hideables.length; i++){
		var elem = hideables[i];
		elem.addEventListener("click", function(){
			var str = this.id;
			str = str.slice((str.indexOf("hide")+4),str.length);
			hideId(str);
		});
	}
	
}

function gatherTableEvents(){
	var table = document.getElementById("gatherT");
	table.addEventListener("pointerdown", function(){
		gatherMouse = true;
		
	});
	table.addEventListener("pointerup", function(){
		gatherMouse = false;
		checkChainGather();
	});
	table.addEventListener("pointerleave", function(){
		gatherMouse = false;
		checkChainGather();
	});
	table.addEventListener("mousedown", function(){
		gatherMouse = true;
		
	});
	table.addEventListener("mouseup", function(){
		gatherMouse = false;
		checkChainGather();
	});
	table.addEventListener("mouseleave", function(){
		gatherMouse = false;
		checkChainGather();
	});
}
function gatherTableCellEvents(row,col){
	cell = cellAt("gatherT",row,col);
	cell.addEventListener( "pointerover",function(){
		buildChainGather(row,col)
	});
	cell.addEventListener("pointerleave", function(){
		buildChainGather(row,col)
	});
	cell.addEventListener( "mouseover",function(){
		buildChainGather(row,col)
	});
	cell.addEventListener("mouseleave", function(){
		buildChainGather(row,col)
	});
}

function changeColorEvents(){
	for(var color in settings.colors){
		var input = document.getElementById(("input" + color));
		var reset = document.getElementById(("reset" + color));
		input.addEventListener("input", function(){
			var col = this.id.slice(5);
			settings.colors[col] = this.value;
			loadGather();
		},false);
		reset.addEventListener("click", function(){
			var col = this.id.slice(5);
			var inp = document.getElementById(("input" + col));
			inp.value = settings.startColors[col];
			settings.colors[col] = settings.startColors[col];
			loadGather();
		},false);
	}
}
