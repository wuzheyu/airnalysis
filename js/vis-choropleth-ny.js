
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

    vis.margin = {top: -50, right: 0, bottom: -60, left: 60}
    vis.width = map_width - vis.margin.left - vis.margin.right
    vis.height = 370 - vis.margin.top - vis.margin.bottom;


// --> CREATE SVG DRAWING AREA
    vis.svg = d3.select("#"+vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

// Add title
//     vis.svg.append("text")
//         .attr("class","viz-title")
//         .attr("transform","translate("+vis.width/2+","+(vis.height-70)+")")
//         .text("Viz title: Price difference");


    // Initialize projection and path
    vis.projection = d3.geoMercator()
        .translate([vis.width / 2, vis.height / 2])
        .scale(35000)
        .center([-73.9,40.7]);

    vis.path = d3.geoPath()
        .projection(vis.projection);

// Colormap
// var color = d3.scaleSequential(d3.interpolateReds); // continuous colormap
    vis.color = d3.scaleQuantize()
        .range(d3.range(5).map(function(i) {
            var scale = ["#F2C9CC","#F28D95","#F25764","#B51623","#610007"]
            return scale[i];
        }));


// Initialize legend
    vis.legend = d3.select("#map-legend").append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", 50)
        .append("g")
        .attr("class", "legendSequential")
        .attr("transform", "translate(0,30)")

    var squares = vis.legend.selectAll("rect.legendsquare")
        .data(d3.range(5));

    var square_width = 15;

    squares.enter()
        .append("rect")
        .attr("class","legendsquare")
        .merge(squares)
        .attr("x", d=>d*90)
        .attr("y",0)
        .attr("width", square_width)
        .attr("height",square_width)
        .attr("fill",d=>(vis.color(d/5)));

    var legend_texts = vis.legend.selectAll("text.range")
        .data(d3.range(5));
    legend_texts.enter()
        .append("text")
        .attr("class","range")
        .merge(legend_texts)
        .attr("x", d=>(d*90+square_width+2))
        .attr("y",square_width-2)
        .text(function(d){
            return (d*40)+" to "+((d+1)*40)
        })

    vis.legend.append("rect")
        .attr("x",400)
        .attr("y",-20)
        .attr("width", square_width)
        .attr("height",square_width)
        .attr("fill","gray");

    vis.legend.append("text")
        .attr("x",400 +square_width+2)
        .attr("y",-20+square_width-2 )
        .text("N/A");

    //legend title
    vis.legend.append("text")
        .attr("id","legendtitle")
        .attr("y",-10)
        .text("Price difference per night (Airbnb - rental)");

    //
    // vis.svg.append("g")
    //     .attr("class", "legendSequential")
    //     .attr("transform", "translate("+(vis.width/2-280)+","+(vis.height-400)+")");

    vis.legendtitle = vis.legend.append("text")
        .attr("id", "legend_title")
        // .attr("transform", "translate("+(vis.width/2-280)+","+(vis.height-410)+")");

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
        // .attr("stroke","black")
        // .attr("stroke-width",2)
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
        // .attr("stroke","none")
        // .attr("stroke-width",1)
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

    // // another layer of boroughs on top
    // vis.borough2 = vis.svg.selectAll("path.borough2")
    //     .data(vis.nyc_borough.features);
    //
    // vis.borough2.enter().append("path")
    //     .attr("class",'borough2')
    //     .merge(vis.borough2)
    //     .attr("d", vis.path)
    //     // .attr("stroke","black")
    //     // .attr("stroke-width",1)
    //     .attr("fill", function(d){
    //         var borough = d.properties.name;
    //         return vis.color(vis.displayData[borough]['price_diff']);
    //     });

    // Add tooltip
    vis.tip = d3.tip().attr('class', 'd3-tip').attr("data-html", "true").html(function(d) {
        if (d.properties.name){   // when d is the base borough
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
        .on('mouseover', function(d) {
            show_small_multiples(d);
            vis.tip.show(d);
        })
        .on('mouseout', vis.tip.hide);

    vis.tip.offset([0, 0]);

    vis.choropleth.exit().remove();

    // // add hint
    // vis.svg.append("text")
    //     .attr("class","viz-comment")
    //     .attr("id","see-change")
    //     .attr("transform","translate(0"+","+200+")")
    //     .text("* Hover to see what happens if there're more rooms");


}
