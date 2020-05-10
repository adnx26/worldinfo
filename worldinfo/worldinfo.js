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
        'https://worldinf.imfast.io/worldinfo/data/covid-19-latest.json',
        function (data) {
            map = anychart.map();

            // set map title and title settings
            map.title()
                .enabled(true)
                .padding([10, 0, 10, 0])
                .text('World COVID-19 Infection\n');

            // Sets geodata using https://cdn.anychart.com/geodata/2.0.0/custom/world/world.js
            map.geoData('anychart.maps.world');

            // set chart padding
            map.padding(0);

            // set polygon marquee colors
            map.selectPolygonMarqueeFill('#333 .3');
            map.selectPolygonMarqueeStroke('#333');

            // create bubble series
            var series = map.bubble(data);

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




function test() {
    anychart.data.loadJsonFile(
        // The data used in this sample can be obtained from the CDN
        'https://worldinf.imfast.io/Corona-test.json',
        function (data) {
            map = anychart.map();

            // set map title and title settings
            map.title()
                .enabled(true)
                .padding([10, 0, 10, 0])
                .text('World Mammals Species Threatened, by country\n');

            // Sets geodata using https://cdn.anychart.com/geodata/2.0.0/custom/world/world.js
            map.geoData('anychart.maps.world');

            // set chart padding
            map.padding(0);

            // set polygon marquee colors
            map.selectPolygonMarqueeFill('#333 .3');
            map.selectPolygonMarqueeStroke('#333');

            // create bubble series
            var series = map.bubble(data);

            // set chart bubble settings
            map.minBubbleSize('.7%')
                .maxBubbleSize('7%');

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

// helper function to update chart title on points select
function updateChartTitle(points) {
    // get selected points sizes sum
    var selectedPointsSize = points.reduce(function (sum, point) {
        return sum + point.get('size');
    }, 0);

    // set new chart title
    map.title().text('People Infected With Covid-19 , by country ' + selectedPointsSize + '\n  Last Updated May 10, 2020 ');
}
