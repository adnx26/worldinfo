var map;

anychart.onDocumentReady(drawCoronoChart());


function drawCoronoChart() {
    anychart.data.loadJsonFile(
        // The data used in this sample can be obtained from the CDN
        'https://worldinf.imfast.io/corona.json',
        function (data) {
            map = anychart.map();


            // set map title and title settings
            map.title()
                .enabled(true)
                .padding([10, 0, 10, 0])
                .text('World COVID-19 Infection\nLast Updated June 6, 2020\nDeveloped by Advaith Nair');
                

            // Sets geodata using https://cdn.anychart.com/geodata/2.0.0/custom/world/world.js
            map.geoData('anychart.maps.world');

            // set chart padding
            map.padding(0);

            // set polygon marquee colors
            map.selectPolygonMarqueeFill('#333 .3');
            map.selectPolygonMarqueeStroke('#333');

            // create bubble series
            var series = map.bubble(data);

            series.labels().format("{%name}");
            series.tooltip().format("{%size} Infected \n{%Deaths} Deaths \n{%Recovered} Recovered ")



    
            // set chart bubble settings
            map.minBubbleSize('1%')
                .maxBubbleSize('8%');

            // set bubble series settings
            series
                .fill('red .6')
                .stroke('#333')
                .selectionMode('multi-select');

            // listen pointsSelect event
            map.listen('pointsSelect', function () {
                // get selected points
                var points = map.getSelectedPoints();
                // update chart title
                updateChartTitle(points);
            });

            // create zoom controls
            var zoomController = anychart.ui.zoom();
            zoomController.render(map);

            // set container id for the chart
            map.container('container');
            // initiate chart drawing
            map.draw();
        });
}
