
/*
 *  footprintMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

footprintMap = function(_parentElement, _data, _mapPosition) {

	this.parentElement = _parentElement;
	this.data = _data;
	this.mapPosition = _mapPosition;
	this.initVis();
}


/*
 *  Initialize station map
 */

footprintMap.prototype.initVis = function() {
	var vis = this;

	vis.map = L.map('company-choropleth').setView(vis.mapPosition, 1);

	L.Icon.Default.imagePath = 'img/';
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(vis.map)

	//vis.events = L.layerGroup().addTo(vis.map);
	//vis.wrangleData();
}



/*
 *  The drawing function
 */

footprintMap.prototype.updateVis = function() {
    var vis = this;
    console.log(vis.data)
	vis.data.forEach(function(d, index) {
        setTimeout(function(){
            L.marker([d.lat, d.lon]).bindPopup(
                "<b>" + d.event + "</b>"
                ).addTo(vis.map);
        }, index * 1000);
    
	})

}
