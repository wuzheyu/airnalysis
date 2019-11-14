

queue()
    .defer(d3.json, 'data/world-110m.json')
    .await(function(error, rawWorldMap){
        var worldMap = topojson.feature(rawWorldMap, rawWorldMap.objects.countries).features;
        var worldMapContainer = '#company-choropleth';

        var mapMargin = { top: 50, right: 50, bottom: 50, left: 50 };
        var mapWidth = $(worldMapContainer).width() - mapMargin.left - mapMargin.right;
        var mapHeight = 400 - mapMargin.top - mapMargin.bottom;

        mapSVG = d3.select(worldMapContainer)
            .append("svg")
            .attr("width", mapWidth + mapMargin.left + mapMargin.right)
            .attr("height", mapHeight + mapMargin.top + mapMargin.bottom)
            .append('g')
            .attr('transform', "translate(" + mapMargin.left + "," + mapMargin.top + ")");

        mapProjection = d3.geoMercator()
            .translate([mapWidth / 2, mapHeight / 1.75])
            //.scale([150]);

        var path = d3.geoPath()
            .projection(mapProjection);

        mapSVG.selectAll("path")
            .data(worldMap)
            .enter().append("path")
            .attr("d", path)
            .style('fill', '#736e6f')
            .style('stroke', '#ebebeb');

    })
       
