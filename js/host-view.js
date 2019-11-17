// Load shape of NYC (GeoJSON) and airbnb listings
// Load data parallel
queue()
    .defer(d3.json, "data/new-york-city-boroughs.geojson")
    .defer(d3.csv, "data/ny-listings.csv")
    .await(createVisualization);

function createVisualization(error, nyc_contour, nyc_listings) {
    // console.log(nyc_contour);
    // console.log(nyc_listings);
    mapchart = new MapChart("ny-map", {"contour":nyc_contour,"listings":nyc_listings});
}

