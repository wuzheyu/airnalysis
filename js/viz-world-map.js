
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


var Stamen_TonerLite = L.tileLayer('', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});
/*
 *  Initialize station map
 */

footprintMap.prototype.initVis = function() {
	var vis = this;

	vis.map = L.map(vis.parentElement, {zoomControl: false}).setView(vis.mapPosition, 1);

	L.Icon.Default.imagePath = 'img/';

	// L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
	// 	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	// }).addTo(vis.map)
	
	L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
		subdomains: 'abcd',
		maxZoom: 19
	}).addTo(vis.map)

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
            L.marker([d.lat, d.lon], {
				bounceOnAdd: true,
				icon: redIcon
			}).bindPopup(
                "<span style='color:rgb(255,78,87)'><b>" + '[' + formatDate(d.year) + ' ' + d.location + ']' + "</b></span>" + ' ' + d.event + '.'
                ).addTo(vis.map);
        }, (index + 1)* 1000);
    
	})

}
