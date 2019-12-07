
forceChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.initVis();
}

forceChart.prototype.initVis = function(){
    // load data
	var vis = this;

	// define svg propertities
	vis.margin = {top: -10, right: 60, bottom: 50, left: 0};
	
	vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
    vis.height = 300 - vis.margin.top - vis.margin.bottom;

	// SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement)
            .append("svg")
            .attr("class", "forced-layout")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.force = d3.forceSimulation(vis.data.nodes)
            .force("charge", d3.forceManyBody().strength(5))
            .force("y", d3.forceY(vis.height/2))
            .force("link", d3.forceLink(vis.data.linksPast).distance(40))
            .force("center", d3.forceCenter().x(vis.width/2).y(vis.height/2))
            .force("collide", d3.forceCollide(50));
    console.log(vis.force)
    // 3) DRAW THE LINKS (SVG LINE)
    vis.link = vis.svg.selectAll(".link")
                .data(vis.data.linksPast)
                .enter()
                .append("line")
                .attr("class", "link")

    // 4) DRAW THE NODES (SVG CIRCLE)
    vis.node = vis.svg.selectAll(".node")
                .data(vis.data.nodes)
                .enter()
                .append("g")
                .attr("class", "node")

    vis.node.append("image")
    .attr("xlink:href", function(d){
        if (d.name == "Airbnb") {
            return "img/airbnb.png";
        }
        else if (d.name == "Homeaway"){
            return "img/homeaway.png";
        }
        else if (d.name == "Hilton"){
            return "img/hilton.png";
        }
        else if (d.name == "IHG"){
            return "img/ihg.png";
        }
        else if (d.name == "Marriott"){
            return "img/marriott.png";
        }
    })

    .attr("width", function(d) { 
        if (d.name == "Marriott") {
            return 100;
        }
        else if (d.name == "Airbnb") {
            return 70;
        }
        else return 100;
    })
    .attr("height", function(d) {
        if (d.name == "Airbnb") return 70;
        else return 100;
    });

    vis.node.call(
        d3.drag()
        .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded)
    )
    vis.node.append("title")
    .text(function(d) { return d.name; });

    // 5) LISTEN TO THE 'TICK' EVENT AND UPDATE THE X/Y COORDINATES FOR ALL ELEMENTS
    vis.force.on("tick", function(){

    vis.node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    vis.link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    })
    vis.wrangleData();

    // (Filter, aggregate, modify data)
    //Define drag event functions

    function dragStarted(d) {
        if (!d3.event.active) vis.force.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
    }

    function dragging(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragEnded(d) {
        if (!d3.event.active) vis.force.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
	
}

forceChart.prototype.wrangleData = function(){
    var vis = this;
    vis.updateVis();
}

forceChart.prototype.updateVis = function(){
    var vis = this;
    setInterval(function(){vis.force.alpha(0.1);},250);
    if (userSelectedTime == 'linksPresent') {
        vis.force.force("charge", d3.forceManyBody().strength(-10))
        vis.force.force("link", d3.forceLink(vis.data.linksPresent).distance(150))
        vis.force.force("x", d3.forceX(function(d){
            if(d.group == 1) {
                return 10;
            }
            else {
                return 100;
            }
        })
        );
        vis.force.force("collide", d3.forceCollide(15));
        vis.link.data(vis.data.linksPresent)
    }
    else if (userSelectedTime == 'linksFuture') {
        vis.force.force("charge", d3.forceManyBody().strength(50))
        vis.force.force("link", d3.forceLink(vis.data.linksFuture).distance(15))
        vis.force.force("collide", d3.forceCollide(17));
        vis.link.data(vis.data.linksFuture)
    }
    else if (userSelectedTime == 'linksPast') { 
        vis.force.force("charge", d3.forceManyBody().strength(-10))
        vis.force.force("link", d3.forceLink(vis.data.linksPast).distance(40))
        vis.force.force("collide", d3.forceCollide(50));
        vis.link.data(vis.data.linksPast)
    }

}

