function SeedGenerator(){
	
}

SeedGenerator.Get = function(index){
	var seedBase = new Random().uniform(1,1000);
	var seed = seedBase*(index + 1);
	console.log("Seed " + index + " : " + seed); 
}