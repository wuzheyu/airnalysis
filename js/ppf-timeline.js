var desc_mapping = {
        "Past":"For a long time, the hotel industry did not consider Airbnb a threat. Both the industry and Airbnb claimed they were serving different markets and had different underlying business models.",
        "Present":"A stage of denial was followed by the American Hotel & Lodging Association (AH&LA) attacking Airbnb by sponsoring research to demonstrate its negative impacts on the economy and lobbying governments to impose taxes and regulations on homesharing. ",
        "Future":"The next stage of this battle involves competition and integration. Hotels are looking to add homesharing-like attributes and also looking to tap into the platform-based business model that underlies Airbnb’s success."
}
var title_mapping = {
    "Past": "Denial",
    "Present": "Attack",
    "Future": "Participation"
}

ppf_timelinePlot = function(_parentElement){
    this.parentElement = _parentElement;
    this.data = [
        {'index': 0, 'name':'Past'},
        {'index': 1, 'name':'Present'},
        {'index': 2, 'name':'Future'},
    ];
    this.initVis();
}

ppf_timelinePlot.prototype.initVis = function(){
    // load data
	var vis = this;
	// define svg propertities
	vis.margin = {top: 10, right: 50, bottom: 20, left: 80};
	
	vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
    vis.height = 500 - vis.margin.top - vis.margin.bottom;


	// SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement)
			.append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");
    
   vis.svg.append("line")
            .attr("class", "ppf-timeline-line")         // attach a line
            .attr("x1", vis.width/2)     // x position of the first end of the line
            .attr("y1", 155)      // y position of the first end of the line
            .attr("x2", vis.width/2)     // x position of the second end of the line
            .attr("y2", 195);    // y position of the second end of the line

    vis.svg.append("line")
            .attr("class", "ppf-timeline-line")         // attach a line
            .attr("x1", vis.width/2)     // x position of the first end of the line
            .attr("y1", 305)      // y position of the first end of the line
            .attr("x2", vis.width/2)     // x position of the second end of the line
            .attr("y2", 345);    // y position of the second end of the line

    vis.tool_tip = d3.tip()
    .attr("class", "timeline-tooltip")
    .html(function(d) { 
        if (d.name == 'Past') {
            return "<b style='font-size: 28px';'color:rgb(255,78,87)'>Denial</b><br>For a long time, the hotel industry did not consider Airbnb a threat. Both the industry and Airbnb claimed they were serving different markets and had different underlying business models."
        }
        else if (d.name == 'Present') {
            return "<b style='font-size: 28px;'color:rgb(255,78,87)'>Attack</b><br>A stage of denial was followed by the American Hotel & Lodging Association (AH&LA) attacking Airbnb by sponsoring research to demonstrate its negative impacts on the economy and lobbying governments to impose taxes and regulations on homesharing. "
        }
        else if (d.name == 'Future') {
            return "<b style='font-size: 28px;'color:rgb(255,78,87)'>Participation</b><br>The next stage of this battle involves competition and integration. Hotels are looking to add homesharing-like attributes and also looking to tap into the platform-based business model that underlies Airbnb’s success."
        }

    })
    .style("left", 0 + "px")     
    .style("top", 0 + "px");

    vis.svg.call(vis.tool_tip);
    var elements = vis.svg.selectAll("g").data(vis.data)
    elemEnter = elements.enter().append("g")
    vis.circles = elemEnter
        .append('circle')
        .attr("class", "ppf-timeline-cycle")
        .attr("id",function(d) {
            return d['name'];
        })
        .attr("cx",vis.width/2)
        .attr("cy",function(d) {
            return 100 + 150 * d['index'];
        })
        .attr("r", 55)
        .on("mouseover", function(d){
            //vis.tool_tip.show(d)
            $("#current-status").html(title_mapping[this.id])
            $("#current-status-desc").html(desc_mapping[this.id])

            if (this.id == 'Past'){
                userSelectedTime = 'linksPast';
                forcePlot.updateVis();
            }
            else if (this.id == 'Present') {
                userSelectedTime = 'linksPresent';
                forcePlot.updateVis();
            }
            else if (this.id == 'Future') {
                userSelectedTime = 'linksFuture';
                forcePlot.updateVis();
            }
        })
        // .on("mouseout", vis.tool_tip.hide)

    vis.texts = elemEnter
        .append("text")
        .text(function(d){
            return d['name'];
        })
        .attr("x", vis.width/2)
        .attr("y", function(d) {
            return 105 + 150 * d['index'];
        })
        .style("text-anchor", "middle")
        .style("fill", "white")
}


