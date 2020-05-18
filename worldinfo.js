var map;

/*
anychart.onDocumentReady(function () {
    anychart.data.loadJsonFile(
        // The data used in this sample can be obtained from the CDN
        'https://cdn.anychart.com/samples-data/maps-general-features/world-mammal-species-theatened.json',
        drawEndagerAnimal(data));

    });

*/

anychart.onDocumentReady(drawCoronoChart());


function drawCoronoChart() {
    anychart.data.loadJsonFile(
        // The data used in this sample can be obtained from the CDN
        'https://worldinf.imfast.io/covid19.json',
        function (data) {
            map = anychart.map();


            // set map title and title settings
            map.title()
                .enabled(true)
                .padding([10, 0, 10, 0])
                .text('World COVID-19 Infection\nLast Updated May 10, 2020');
                

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
            series.tooltip().format("{%size} Infected \n{%death} Deaths \n{%recovered} Recovered ")



    
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


