
// hotel_airbnb_SVG drawing area

var margin = {top: 80, right: 20, bottom: 60, left: 60};

var width = 600 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

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
		.text("Rates Per Night")
// Create x label
var xLabel = hotel_airbnb_svg.append("text")
	.attr("x", width - 100)
	.attr("y", height + 30)
	.style("fill", "grey")
	.text("Day in a week")
// Date parser. Convert a Date to string
var formatDate = d3.timeFormat("%Y");

// convert string to date object
var parseDate = d3.timeParse("%A");

// Scales
var x = d3.scaleLinear()
    .range([0, width])

var y = d3.scaleLinear()
    .range([height, 0]);

// Create x/y axis
var xAxis = d3.axisBottom()//.tickFormat(formatDate);
var yAxis = d3.axisLeft()

// Adding x axis to the hotel_airbnb_svg
hotel_airbnb_svg.append("g")
	.attr("class", "x-axis axis")
	.attr("transform", "translate(0, " + height + ")")
// Adding y axis to the hotel_airbnb_svg
hotel_airbnb_svg.append("g")
	.attr("class", "y-axis axis")

// Initialize data
loadData();

// use this variable to store the selected chart data value - by default it should be "GOALS"
var userSelection = d3.select("#attribute-select").property("value");

// weekday data
var weekdayData;

// year data
var yearData;



// Load json file
function loadData() {
	d3.json("data/hotel-airbnb-nyc.json", function(error, json) {
        console.log(json)
        weekdayData = json.weekdayData;
        yearData = json.yearData;

        console.log(weekdayData)
        console.log(yearData)

		weekdayData.forEach(function(d){
			// Convert string to 'date object'
			d.weekDay = d.weekDay;
			
			// Convert numeric values to 'numbers'
			d.airbnbOccupancy = +d.airbnbOccupancy;
			d.hotelOccupancy = +d.hotelOccupancy;
			d.airbnbRate = +d.airbnbRate;
			d.hotelRate = +d.hotelRate;
		});

        yearData.forEach(function(d){
			// Convert string to 'date object'
			d.year = d.year;
			// Convert numeric values to 'numbers'
			d.numberOfHotelRooms = +d.numberOfHotelRooms;
			d.numberOfAirbnbListings = +d.numberOfAirbnbListings;
		});
		updateHotelAirbnbVisualization();
	});
}


// Create line generator
var airbnbLine = d3.line();
var hotelLine = d3.line();

// Handle the case where the user selection changes
d3.select("#attribute-select").on("change", selectHandler);
function selectHandler(){
	userSelection = d3.select("#attribute-select").property("value");
	yLabel.text(userSelection);
	updateHotelAirbnbVisualization();
}




// // Set up the tool tip
// var tool_tip = d3.tip()
// 	.attr("class", "d3-tip")
// 	.offset([-8, 0])
// 	.html(function(d) { return d.EDITION + "</br>" + `${userSelectionMapping[userSelection]}: ` +  d[userSelection]});

// hotel_airbnb_svg.call(tool_tip);

var userSelectionMapping = {
	"numberOfRooms": ["numberOfAirbnbListings","numberOfHotelRooms"],
	"rates": ["airbnbRate", "hotelRate"],
	"occupancy": ["airbnbOccupancy", "hotelOccupancy"],
}

// Render visualization
function updateHotelAirbnbVisualization() {
	// Filter the data based on the user input year range
	var weekDayMin = d3.min(weekdayData, function(d) { return d.weekDay;});
	var weekDayMax = d3.max(weekdayData, function(d) { return d.weekDay;});
	x.domain([weekDayMin, weekDayMax]);

    var airbnbSelection = userSelectionMapping[userSelection][0];
    var hotelSelection = userSelectionMapping[userSelection][1];
	var userSelectionMax = d3.max(weekdayData, function(d) { return Math.max(d[airbnbSelection], d[hotelSelection]);});
	y.domain([0, userSelectionMax])

	// Scale the axis functions
	xAxis.scale(x);
	yAxis.scale(y);

	// Create line generator
	airbnbLine.x(function(d) { return x(d.weekDay); }) 
		.y(function(d) { return y(d[airbnbSelection]); })
		//.curve(d3.curveCardinal);

    hotelLine.x(function(d) { return x(d.weekDay); }) 
		.y(function(d) { return y(d[hotelSelection]); })
        //.curve(d3.curveCardinal);
        
	var airbnbLines = hotel_airbnb_svg.selectAll(".airbnbLine").data([weekdayData], function(d){ return d[airbnbSelection]});
    var hotelLines = hotel_airbnb_svg.selectAll(".hotelLine").data([weekdayData], function(d){ return d[hotelSelection]});

    const transitionPath = d3
    .transition()
    .ease(d3.easeSin)
    .duration(2500);
    
	airbnbLines.enter()
		 .append("path")
		 .attr("class", "airbnbLine")
		 .merge(airbnbLines)
		 .transition(transitionPath)
		 //.duration(1000)
         .attr("d", airbnbLine)
         
    hotelLines.enter()
		 .append("path")
		 .attr("class", "hotelLine")
		 .merge(hotelLines)
		 .transition(transitionPath)
		 //.duration(800)
		 .attr("d", hotelLine)
	
	// Draw axis
	d3.select(".x-axis")
		.transition()
		.duration(1000)
		.call(xAxis);
	  
	d3.select(".y-axis")
		.transition()
		.duration(1000)
		.call(yAxis);
	
}



// // Show details for a specific FIFA World Cup
// function showEdition(d){
// 	var descString = "";
//     descString += "<h4>" + d.EDITION + "</h4>";
// 	descString += "<tr>" + "<th>" + "Winner: " + "</th>" + "<td>" + d.WINNER + "</td>" + "</tr>";
//     descString += "<tr>" + "<th>" + "Goals: " + "</th>" + "<td>" + d.GOALS + "</td>" + "</tr>";
// 	descString += "<tr>" + "<th>" + "Matches: " + "</th>" + "<td>" + d.MATCHES + "</td>" + "</tr>";
// 	descString += "<tr>" + "<th>" + "Average Goals: " + "</th>" + "<td>" + d.AVERAGE_GOALS + "</td>" + "</tr>";
// 	descString += "<tr>" + "<th>" + "Teams: " + "</th>" + "<td>" + d.TEAMS + "</td>" + "</tr>";
// 	descString += "<tr>" + "<th>" + "Average Attendance: " + "</th>" + "<td>" + d.AVERAGE_ATTENDANCE + "</td>" + "</tr>";

// 	document.getElementById("FIFAInfo").innerHTML = descString;
// }




