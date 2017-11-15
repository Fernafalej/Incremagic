var upgrades = {
	"gameR" : {
		 
	},
	"gameG" : {
		 
	},
	"gameB" : {
		 
	}
};

function craftUpgrade(name, level){
	if(isUpgradeCraftable(name,level)){
		for(var i = 0; i < craftRecipesUpgrades[name].cost.length;i++){
			var cost = craftRecipesUpgrades[name].cost[i];
			if(cost.type == "essence"){
				console.log("not implemented");
			}
			else if(cost.type == "crystal"){
				console.log("not implemented");
			}
			else if(cost.type == "rune"){
				runes[cost.name][(cost.level+level*cost.increaseLevelPerLevel)] -= cost.amount + level*cost.increaseLevelPerLevel;
			}
		}
	}
}

function isUpgradeCraftable(name, level){
	if(craftRecipesUpgrades[name].unlocked){
		for(var i = 0; i < craftRecipesUpgrades[name].cost.length;i++){
			var cost = craftRecipesUpgrades[name].cost[i];
			if(cost.type == "essence"){
				console.log("not implemented");
				return false;
			}
			else if(cost.type == "crystal"){
				console.log("not implemented");
				return false;
			}
			else if(cost.type == "rune"){
				if(runes[cost.name][(cost.level+level*cost.increaseLevelPerLevel)]
						< (cost.amount + level*cost.increaseLevelPerLevel)){
					return false;
				}
			}
		}
		return true;
	}
}
