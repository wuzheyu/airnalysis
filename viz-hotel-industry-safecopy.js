var allHotelNames = ['airbnb', 'homeaway', 'hilton', 'ihg', 'marriott']
var hotelOfficialNames = {'airbnb': 'Airbnb', 'homeaway' : 'Homeaway', 'hilton': 'Hilton', 'ihg' : 'IHG', 'marriott' : 'Marriott'}
var color = {'airbnb': '#e41a1c', 'homeaway': '#377eb8','hilton': '#4daf4a','ihg':'#984ea3','marriott':'#ff7f00'}

// hotel_airbnb_SVG drawing area
var margin = {top: 40, right: 80, bottom: 40, left: 130};

var width = 500 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;

var hotel_airbnb_svg = d3.select("#hotel-industry-plot").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create y label
var yLabel = hotel_airbnb_svg.append("text")
		.attr("x", -40)
		.attr("y", -20)
		.style("fill", "grey")
		.text("US Sales($) [Normalized to Airbnb's 2013 U.S. Sales]")
// Create x label
var xLabel = hotel_airbnb_svg.append("text")
	.attr("x", width - 50)
	.attr("y", height + 30)
	.style("fill", "grey")
	.text("Year")

// Date parser. Convert a Date to string
var formatDate = d3.timeFormat("%Y");

// convert string to date object
var parseDate = d3.timeParse("%Y");

// Scales
var x = d3.scaleLinear()
    .range([0, width])

var y = d3.scaleLinear()
    .range([height, 0]);

// Create x/y axis
var xAxis = d3.axisBottom().tickFormat(formatDate);
var yAxis = d3.axisLeft()

// Adding x axis to the hotel_airbnb_svg
hotel_airbnb_svg.append("g")
	.attr("class", "airbnb-hotel-x-axis axis")
	.attr("transform", "translate(0, " + height + ")")
// Adding y axis to the hotel_airbnb_svg
hotel_airbnb_svg.append("g")
	.attr("class", "airbnb-hotel-y-axis axis")

// Create line generator
var hotelLine= d3.line();

// use this variable to store the selected chart data value - by default it should be "GOALS"
var userSelection = d3.select("#hotel-select").property("value");

var lineToolTip;
// year data
var rawData;
var dataPerHotel;

// filter data based on user input
var filterDataPerHotel;
var filterOverallData;

// Initialize data
loadData();

// Load json file
function loadData() {
	d3.csv("data/hotel-airbnb-us-sales.csv", function(error, data) {
        rawData = data;
        console.log(rawData)
		rawData.forEach(function(d){
			// Convert string to 'date object'
			d.year = parseDate(d.year);
			// Convert numeric values to 'numbers'
			d.sales = +d.sales;
		});

		dataPerHotel = d3.nest()
						 .key(function(d) { return d.hotel;})
						 .entries(rawData);
		console.log(dataPerHotel);

		allHotelNames.forEach(function(d, i) {
			hotel_airbnb_svg.append('text')
			.attr('id', 'hotel-tooltip-label-' + d)
			.attr('x', 0)
			.attr('y', 30 + 15*i)
			.attr('fill',color[d])
			.text('');
		});

		lineToolTip = hotel_airbnb_svg.append('line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', height)
        .attr('y2', 0)
        .attr('stroke', 'none')
        .attr('stroke-width', '2px');
	
		updateHotelAirbnbVisualization();
	});
}



// Handle the case where the user selection changes
d3.select("#hotel-select").on("change", selectHandler);
function selectHandler(){
	userSelection = d3.select("#hotel-select").property("value");
	updateHotelAirbnbVisualization();
}


// Render visualization
function updateHotelAirbnbVisualization() {


	if (userSelection == "all") {
		filterDataPerHotel = dataPerHotel;
		filterOverallData = rawData;
		x.domain(d3.extent(rawData, function(d) { return d.year;}));
		y.domain(d3.extent(rawData, function(d) { return d.sales;}));
	}
	else {
		filterDataPerHotel = dataPerHotel.filter(function(d) { return d.key == userSelection;})
		filterOverallData = rawData.filter(function(d) { return d.hotel == userSelection;})
		x.domain(d3.extent(filterOverallData, function(d) { return d.year;}));
		y.domain(d3.extent(filterOverallData, function(d) { return d.sales;}));
	}


	console.log(x.domain())
	// Scale the axis functions
	xAxis.scale(x);
	yAxis.scale(y);

	 

	// Create line generator
	hotelLine.x(function(d) { return x(d.year); }) 
			 .y(function(d) { return y(d.sales); })

	var hotelLines = hotel_airbnb_svg.selectAll(".hotelLine").data(filterDataPerHotel);

	hotelLines.enter()
			  .append("path")
			  .attr("fill", "none")
			  .attr("class", "hotelLine")
			  .attr("stroke-width", 1.5)
			  .merge(hotelLines)
			  .attr("stroke", function(d) { 
				return color[d.key]
			  })
			  .transition()
			  .duration(800)
			  .attr("d", function(d){
				  return hotelLine (d.values)
			   })
	hotelLines.exit().remove();
	
	// Create legend
	var legendCircles = hotel_airbnb_svg.selectAll(".legend-circles").data(filterDataPerHotel);
	var legendTexts = hotel_airbnb_svg.selectAll(".legend-texts").data(filterDataPerHotel);
	legendCircles.enter()
		.append("circle")
		.attr("class", "legend-circles")
		.merge(legendCircles)
		.transition()
		.duration(800)
		.attr("fill", function(d) { 
			return color[d.key]
		})
		.attr("r", 5)
		.attr("cx",-120)
		.attr("cy", function(d, i){
			return (i) * 30;
		})

	legendCircles.exit().remove();

	legendTexts.enter()
		.append("text")
		.attr("class", "legend-texts")
		.merge(legendTexts)
		.transition()
		.duration(800)
		.attr("fill", function(d) { 
			return color[d.key]
		})
		.attr("x",-110)
		.attr("y", function(d, i){
			return (i) * 30 + 5;
		})
		.text(function(d){
			return hotelOfficialNames[d.key];
		})

		legendTexts.exit().remove();

	// Draw axis
	d3.select(".airbnb-hotel-x-axis")
		.transition()
		.duration(800)
		.call(xAxis);
	  
	d3.select(".airbnb-hotel-y-axis")
		.transition()
		.duration(800)
		.call(yAxis);
	
	// tooltip
	var focus = hotel_airbnb_svg.append("g")           
							.style("display", "none");     

	// append the x line
	focus.append("line")
			.attr("class", "x")
			.style("stroke", "rgb(255,78,87)")
			.style("stroke-width", 2)
			.style("opacity", 0.5)
			.attr("y1", 0)
			.attr("y2", height);
						
	hotel_airbnb_svg.append("rect")                                   
			.attr("width", width)                            
			.attr("height", height)                          
			.style("fill", "none")                           
			.style("pointer-events", "all")                  
			.on("mouseover", mousemove)
			.on("mouseout", mouseout)
			.on("mousemove", mousemove);    



	function mousemove() { 
		var bisectYear = d3.bisector(function(d) { return d.year; }).left;                               
		var x0 = x.invert(d3.mouse(this)[0])

		lineToolTip
		.attr('x1', x(x0) - 5)
		.attr('x2', x(x0) - 5)
		.attr('stroke', 'rgb(255,78,87)');

		filterDataPerHotel.forEach(function(d, i) {
			var i = bisectYear(d.values, x0, 1);                  
			var d0 = d.values[i - 1];                              
			var d1 = d.values[i];                                 
			var dA = x0 - d0.year > d1.year - x0 ? d1 : d0;
			d3.select('#hotel-tooltip-label-' + d.key)
			.attr('x', x(x0))
			.text(hotelOfficialNames[d.key] + ": " + d3.format(",.1f")(dA.sales));
		})

	}  

	function mouseout() { 
		lineToolTip.attr('stroke', 'none');
	  	filterDataPerHotel.forEach(function(d) {
			d3.select('#hotel-tooltip-label-' + d.key)
			.text('');
		});

	}  
}




