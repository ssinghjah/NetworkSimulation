function RandomTester(){

	this.run = function(){

		var rand1 = new Random(17);
		var rand2 = new Random(34);
		var rand3 = new Random(51);

		for(var i = 0; i < 10; i++){

			console.log("Random 1 : " + (rand1.uniform(0,7)) );
			console.log("Random 2 : " + (rand2.uniform(0,7)) );
			console.log("Random 3 : " + (rand3.uniform(0,7)) );
		}
	}
}