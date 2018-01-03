var resources = {
	"puzzles" : {
		"essences" :{
			"green" : {
				"amount": [],
				"name": "Mon Essence",
				"position": 1,
			},
			"red" : {
				"amount": [],
				"name": "Gal Essence",
				"position": 2,
			},
			"blue" : {
				"amount": [],
				"name": "Tof Essence",
				"position": 3,
			},
			"aqua" : {
				"amount": [],
				"name": "Unu Essence",
				"position": 4,
			},
			"yellow" : {
				"amount": [],
				"name": "Sata Essence",
				"position": 5,
			},
			"purple" : {
				"amount": [],
				"name": "Nele Essence",
				"position": 6,
			},
		}
	}
}

function changeResource(path,level,value){
	//TODO!!!
	var res = resources;
	for(var i = 0; i < path.length; i++){
		res = res[path[i]];
	}
	res.amount[level] = value;
	updateResource(path,level);
}

function addResource(path,level,value){
	var res = resources;
	for(var i = 0; i < path.length; i++){
		res = res[path[i]];
	}
	if(res.amount[level] == undefined){
		res.amount[level] = 0;
	}
	res.amount[level] += value;
	updateResource(path,level);
}