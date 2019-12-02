
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

	vis.map = L.map(vis.parentElement, {zoomControl: false}).setView(vis.mapPosition, 2);

	L.Icon.Default.imagePath = 'img/';
	// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	// 	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	// }).addTo(vis.map)

	L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(vis.map)
	
	var imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Sydney_Opera_House_-_Dec_2008.jpg/1024px-Sydney_Opera_House_-_Dec_2008.jpg',
	imageBounds = [[-45.386048, 105.360836], [-49.084379, 119.773847]];

	L.imageOverlay(imageUrl, imageBounds).addTo(vis.map);
	L.imageOverlay(imageUrl, imageBounds).bringToFront();

	vis.map.dragging.disable();
	vis.map.touchZoom.disable();
	vis.map.doubleClickZoom.disable();
	vis.map.scrollWheelZoom.disable();

}



/*
 *  The drawing function
 */

footprintMap.prototype.updateVis = function() {
	var vis = this;
	
	var redIcon = new L.Icon({
		iconUrl: 'img/marker-icon-red.png',
		shadowUrl: 'img/marker-shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	  });

    console.log(vis.data)
	vis.data.forEach(function(d, index) {
        setTimeout(function(){
            L.marker([d.lat, d.lon], {icon: redIcon}).bindPopup(
                "<b>" + d.event + "</b>"
                ).addTo(vis.map);
        }, index * 1000);
    
	})

}
