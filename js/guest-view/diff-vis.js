DiffVis = function(_parentElement, _data, _hotel_data, _svg, _width, _height, _orig_bar_chart){
    this.parentElement = _parentElement;
    this.data = _data;
    // this.eventHandler = _eventHandler;
    this.hotel_data = _hotel_data;
    this.svg = _svg;
    this.width = _width;
    this.height = _height;
    this.org_bar_chart = _orig_bar_chart;

    this.init();
}

DiffVis.prototype.init = function() {
    var vis = this;

    vis.neib = d3.scaleBand()
        .range([0, vis.height]);

    vis.valueNeg = d3.scaleLinear()
        .range([0, vis.width/2]);

    vis.valuePos = d3.scaleLinear()
        .range([0, vis.width/2]);

    vis.neibAxis = d3.axisLeft()
        .scale(vis.neib);

    vis.valueAxisNeg = d3.axisBottom()
        .scale(vis.valueNeg)
    vis.valueAxisPos = d3.axisBottom()
        .scale(vis.valuePos)


    vis.svg.append("g")
        .attr("class", "neib-axis axis")
        .attr("transform", "translate(" + vis.width/2 + ", 0)");

    vis.svg.append("g")
        .attr("class", "valueNeg-axis axis")
        .attr("transform", "translate(0, -20)");

    vis.svg.append("g")
        .attr("class", "valuePos-axis axis")
        .attr("transform", "translate(" + vis.width/2 + ", -20)");


    this.prepareData();
}

DiffVis.prototype.prepareData = function() {
    var vis = this;
    vis.hotel_data.sort(function(a, b) {
        return ('' + a.nei).localeCompare(b.nei);
    })

    vis.data.sort(function(a, b) {
        return ('' + a.neightborhood).localeCompare(b.neightborhood);
    })

    vis.display_data = []
    vis.hotel_data.forEach(function(d, index) {
        var price_diff = d.ave_price - vis.data[index].avg_price;
        var new_object = {
            "neigh": d.nei,
            "price_diff": price_diff
        }
        vis.display_data.push(new_object)
    })

    this.render();
}

DiffVis.prototype.render = function() {
    var vis = this;

    let rm_dp = (names) => names.filter((v,i) => names.indexOf(v) === i)
    var neib_domain =  rm_dp(vis.display_data.map(function(d){ return d["neigh"]; }));
    vis.neib.domain(neib_domain);

    var maxValue= d3.max(vis.display_data.map(function(d){ return d.price_diff; }));
    var minValue= d3.min(vis.display_data.map(function(d){ return d.price_diff; }));
    vis.valueNeg.domain([minValue, 0]);
    vis.valuePos.domain([0, maxValue]);

    vis.bar_area = vis.svg.append("g")
        .attr("class", "diff-bar-vis")

    vis.bar_area.selectAll(".diff-bar")
        .data(vis.display_data)
        .enter()
        .append('rect')
        .transition()
        .duration(1000)
        .attr("class", "diff-bar")
        .attr("x", function(d) {
            if (d.price_diff > 0) {
                return vis.width / 2;
            }
            else {
                return vis.valueNeg(d.price_diff);
            }
        })
        .attr("y", function(d) {
            return vis.neib(d.neigh);
        })
        .attr("height", vis.neib.bandwidth())
        .attr("width", function(d) {
            if (d.price_diff > 0) {
                return vis.valuePos(d.price_diff);
            }
            else {
                return (vis.width/2 - vis.valueNeg(d.price_diff));
            }
        })
        .attr("fill", function(d) {
            if (d.price_diff > 0) {
                return "darkred"
            }
            else {
                return "darkblue"
            }
        })
        .attr("opacity", 0.5)

    vis.svg.select(".valueNeg-axis").call(vis.valueAxisNeg);
    vis.svg.select(".valuePos-axis").call(vis.valueAxisPos);
    vis.svg.select(".neib-axis").call(vis.neibAxis);
}