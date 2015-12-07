function LinkCostUpdater(){

	this.start = function(){
		updateAfterInterval.call(this);
	}

	var updateAfterInterval = function()
	{
		this.setTimer(SETTINGS.LinkCostUpdateInterval).done(update);
	}

	var update = function()
	{	
		// Update each link in the topology
		var numRouters = Topology.length;
		for(var i = 0; i < numRouters; i++)
		{
			var routerLinks = Topology[i];
			var numLinks = routerLinks.length;
			for( var j = 0; j < numLinks; j++)
			{

				if(routerLinks[j] === INFINITY || routerLinks[j] === 0)
					continue;
				else 
					routerLinks[j] = Math.round(CustomRandom.get( 1, 10));
			}
		}
		
		// send "LinkUpdated" event to routers
		linkUpdated.fire(linkUpdated);
		linkUpdated.clear();

		updateAfterInterval.call(this);
	}
}

