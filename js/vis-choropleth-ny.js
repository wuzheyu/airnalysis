
////////////////////////// below should be an object ////////////////////////
Choropleth = function(_parentElement, nyc_borough, nyc_neighbor, data_borough, data_neighbor){
    this.parentElement = _parentElement;
    this.nyc_borough = nyc_borough;
    this.nyc_neighbor = nyc_neighbor;
    this.data_borough = data_borough;
    this.data_neighbor = data_neighbor;
    this.displayData = {};

    this.initVis();
}



Choropleth.prototype.initVis = function (){

    var vis = this;

    var map_width = $("#"+vis.parentElement).width();

    vis.margin = {top: 0, right: 0, bottom: 10, left: 60}
    vis.width = map_width - vis.margin.left - vis.margin.right
    vis.height = 520 - vis.margin.top - vis.margin.bottom;


// --> CREATE SVG DRAWING AREA
    vis.svg = d3.select("#"+vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

// Add title
    vis.svg.append("text")
        .attr("class","viz-title")
        .attr("transform","translate("+vis.width/2+","+(vis.height-70)+")")
        .text("Viz title: Price difference");

    vis.svg.append("text")
        .attr("class","viz-comment")
        .attr("transform","translate("+vis.width/3+","+30+")")
        .text("*per night rate difference = airbnb - rental");

    // Initialize projection and path
    vis.projection = d3.geoMercator()
        .translate([vis.width / 2, vis.height / 2])
        .scale(40000)
        .center([-73.9,40.7]);

    vis.path = d3.geoPath()
        .projection(vis.projection);

// Colormap
// var color = d3.scaleSequential(d3.interpolateReds); // continuous colormap
    vis.color = d3.scaleQuantize()
        .range(d3.range(5).map(function(i) { return d3.interpolateReds((i+1)/5); }));

// Initialize legend (ref:https://d3-legend.susielu.com/)
    vis.svg.append("g")
        .attr("class", "legendSequential")
        .attr("transform", "translate("+(vis.width/2-280)+","+(vis.height-400)+")");

    vis.legendtitle = vis.svg.append("text")
        .attr("id", "legend_title")
        .attr("transform", "translate("+(vis.width/2-280)+","+(vis.height-410)+")");

    // Update choropleth
    vis.updateVis();

}

Choropleth.prototype.updateVis = function(){
    var vis = this;

    // get combobox value
    var attr = d3.select("#map-type").property("value");
    var filteredData = vis.data_neighbor.filter(function(d){return d.type === attr});
    vis.displayData = {};
    filteredData.forEach(function(d){
        // vis.displayData[d.Borough] = d;
        vis.displayData[d.neighborhood] = d;
    });
    // add filtered borough data to vis.displayData
    vis.data_borough
        .filter(function(d){return d.type === attr})
        .forEach(function(d){
            vis.displayData[d.Borough] = d;
        })

    console.log(vis.displayData);


    // --> Choropleth implementation

    // Update color scale domain
    // vis.color.domain([d3.min(vis.data_neighbor, d=>d['price_diff']),
    //     d3.max(vis.data_neighbor, d=>d['price_diff'])]);
    vis.color.domain([0,200]);

    // boroughs as base
    vis.borough = vis.svg.selectAll("path.borough")
        .data(vis.nyc_borough.features);

    vis.borough.enter().append("path")
        .attr("class",'borough')
        .merge(vis.borough)
        .attr("d", vis.path)
        .attr("fill", function(d){
            var borough = d.properties.name;
            return vis.color(vis.displayData[borough]['price_diff']);
        });

    // Plot the neighborhoods on top of the boroughs
    vis.choropleth = vis.svg.selectAll("path.neighborhood")
        .data(vis.nyc_neighbor.features);

    vis.choropleth.enter().append("path")
        .attr("class",'neighborhood')
        .merge(vis.choropleth)
        .attr("d", vis.path)
        .attr("fill", function(d){
            // var borough = d.properties.name;
            // return vis.color(vis.displayData[borough]['price_diff']);
            var neighborhood = d.properties.neighbourhood;
            var datum = vis.displayData[neighborhood];
            if(datum){
                if(datum['price_diff']){
                    return vis.color(vis.displayData[neighborhood]['price_diff'])
                }
                else{return 'gray'}
            }else{
                return 'gray';
            }
        });

    // Add tooltip
    vis.tip = d3.tip().attr('class', 'd3-tip').attr("data-html", "true").html(function(d) {
        if (d.properties.name){   // d is the base borough
            return "<h6>Nonresidential Area, "+d.properties.name + "</h6>"
                    + "Details Unavailable"
        }
        var neighborhood = d.properties.neighbourhood;
        var data = vis.displayData[neighborhood];
        var text = "<h6>"+neighborhood+", "+d.properties.neighbourhood_group + "</h6>";
        if(data){
            text = text + "Room type: "+data.type
                + "<br/>Airbnb rate: $"+data.airbnb_price + "/night"
                + "<br/>Rental rate: $"+d3.format("d")(data.rental_price/30) +"/night"
                + "<br/>Airbnb inventory: " + data.airbnb_inventory
                + "<br/>Rental inventory: "+data.rental_inventory;
        }else{
            text = text + "Details Unavailable"
        }
        return text
    });
    vis.svg.call(vis.tip);
    vis.svg.selectAll("path")
        .on('mouseover', vis.tip.show, function(d) {
            show_small_multiples(d);
        })
        .on('mouseout', vis.tip.hide)
        // .on('click', function(d) {
        //
        // });
    vis.tip.offset([0, 0]);

    vis.choropleth.exit().remove();

    // Update legend
    if (attr === "At_risk" || attr === "At_high_risk"){
        attr = attr + "(%)";
        vis.legendtitle.text(attr);

        var legend = d3.legendColor()
            .scale(vis.color)
            .labelFormat(d3.format("d"));

        vis.svg.select(".legendSequential")
            .call(legend);
    } else {
        vis.legendtitle.text("Rate Difference (per night) for "+attr);
        var legend = d3.legendColor()
            .scale(vis.color)
            .labelFormat(d3.format(".2s"));
        vis.svg.select(".legendSequential")
            .call(legend);
    }

}