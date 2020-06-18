var map;

anychart.onDocumentReady(drawCoronaMap(), drawBarChart());


function drawCoronaMap(){
    // set chart theme
  anychart.theme('darkBlue');
          anychart.data.loadJsonFile(
            // The data used in this sample can be obtained from the CDN
            'https://worldinf.imfast.io/corona.json',
            function (data) {
              map = anychart.map();
  
              // set map title and title settings
              map
                .title()
                .enabled(true)
                .padding([10, 0, 10, 0])
                .text('World COVID-19 Dashboard\nLast Updated June 17, 2020\nDeveloped by Advaith Nair');
  
              // Sets geodata using https://cdn.anychart.com/geodata/2.0.0/custom/world/world.js
              map.geoData('anychart.maps.world');
  
              // set chart padding
              map.padding(0);
  
              // set polygon marquee colors
              map.selectPolygonMarqueeFill('#333 .30');
              map.selectPolygonMarqueeStroke('#333');

              
  
              // create bubble series
              var series = map.bubble(data);

              series.labels().format("{%name}");
              series.tooltip().format("{%size} Infected \n{%Deaths} Deaths \n{%Recovered} Recovered ")
  
              // set chart bubble settings
              map.minBubbleSize('1%').maxBubbleSize('8%');
  
              // set bubble series settings
              series.fill('red .6').stroke('#333').selectionMode('multi-select');
  
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
              map.container('map');
              // initiate chart drawing
              map.draw();
            }
          );

          function updateChartTitle(points) {
            // get selected points sizes sum
            var selectedPointsSize = points.reduce(function (sum, point) {
                    return sum + point.get('size');
            }, 0);
                    
            // set new chart title
             map
                    .title()
                    .text(
                    'World Mammals Species Threatened , by country\n' +
                    selectedPointsSize +
                    '  Mammal Species threatened in selected area in 2018 '
                    );
            }
        }

function drawBarChart(){
    anychart.data.loadJsonFile(
        'https://worldinf.imfast.io/corona.json',

        function(data){
            anychart.theme('darkBlue');

            var nameList = new Array();
            var sizeList = new Array();
            var corona = [
                [],[],[],[],[],[],[],[],[],[]    
            ]
            
            data.sort((a,b) => b.size - a.size);
            

            var size = 10;
            var listItem = data.slice(0, size);
        

            for(i=0; i<10; i++){
                corona[i].push(listItem[i].name, Math.round(listItem[i].size/10000));
            }


            console.log("Old Array List");
            console.log(listItem);
            console.log("New Array List");
            console.log(corona);




            var dataset = anychart.data.set(corona);
            var mapping = dataset.mapAs({x:0    ,value:1});

            var chart = anychart.bar();

            var series = chart.bar(mapping);

            chart.title("Top 10 Countries Infected with Covid-19 \n In 10000s");
            
            chart.container("chart");

            chart.draw();
        }
    );
        
}


