/*
  Script to generate Map and Charts using GIS COVID Data
  Author : Advaith Nair
  Last Updated : June 19, 2020
  Copyright 2020 www.advaithn.com
*/



var map;

anychart.onDocumentReady(drawCoronaMap(), drawBarChart());


function drawCoronaMap() {
  // set chart theme
  anychart.theme('darkBlue');
  anychart.data.loadJsonFile(
    // The data is recived from the ESRI website https://www.esri.com/en-us/covid-19/overview
    'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/Coronavirus_2019_nCoV_Cases/FeatureServer/2/query?where=1%3D1&outFields=*&outSR=4326&f=json',
    function (data) {
      var coronadata = [];

      var tempArr = [];
      for (i = 0; i < data.features.length; i++) {

        tempArr[0] = String(data.features[i].attributes.Country_Region);
        tempArr[1] = parseInt(data.features[i].attributes.Confirmed);
        tempArr[2] = parseInt(data.features[i].attributes.Deaths);
        tempArr[3] = parseInt(data.features[i].attributes.Recovered);
        tempArr[4] = parseFloat(data.features[i].attributes.Lat);
        tempArr[5] = parseFloat(data.features[i].attributes.Long_);
        tempArr[6] = parseInt(data.features[i].attributes.Last_Update);

        coronadata[i] = tempArr;
        tempArr = [];
      }

      //Sort Data by Conformed Rate
      coronadata.sort((a, b) => b[1] - a[1]);
      map = anychart.map();
      var d = new Date(coronadata[0][6]);
      var newDate = d.toLocaleDateString();
      console.log(newDate);


      // set map title and title settings
      map
        .title()
        .enabled(true)
        .padding([10, 0, 10, 0])
        .text('Last Updated ' + newDate);

      // Sets geodata using https://cdn.anychart.com/geodata/2.0.0/custom/world/world.js
      map.geoData('anychart.maps.world');

      // set chart padding
      map.padding(0);

      // set polygon marquee colors
      map.selectPolygonMarqueeFill('#333 .3');
      map.selectPolygonMarqueeStroke('#333');

      var graphdata = anychart.data.set(coronadata);
      //Map the Data to the AnyChart Preferences
      var mapping = graphdata.mapAs({ name: 0, size: 1, deaths: 2, recovered: 3, lat: 4, long: 5, update: 6 });



      // create bubble series
      var series = map.bubble(mapping);

      series.labels().format("{%name}");
      series.tooltip().format("{%size} Infected \n{%deaths} Death \n{%recovered} Recovered ")

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

  }
}

function drawBarChart() {
  anychart.data.loadJsonFile(
    'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/Coronavirus_2019_nCoV_Cases/FeatureServer/2/query?where=1%3D1&outFields=*&outSR=4326&f=json',

    function (data) {
      //Get Data from the ESRI website https://www.esri.com/en-us/covid-19/overview
      var coronadata = [];

      var tempArr = [];
      for (i = 0; i < data.features.length; i++) {

        tempArr[0] = String(data.features[i].attributes.Country_Region);
        tempArr[1] = parseInt(data.features[i].attributes.Confirmed);
        tempArr[2] = parseInt(data.features[i].attributes.Deaths);
        tempArr[3] = parseInt(data.features[i].attributes.Recovered);
        tempArr[4] = parseFloat(data.features[i].attributes.Lat);
        tempArr[5] = parseFloat(data.features[i].attributes.Long_);
        tempArr[6] = parseInt(data.features[i].attributes.Last_Update);

        coronadata[i] = tempArr;
        tempArr = [];
      }

      //Sort Data by Conformed Rate
      coronadata.sort((a, b) => b[1] - a[1]);


      var barChartData = [
        [], [], [], [], [],[], [], [], [], []
      ]

      console.log(coronadata);

      var size = 10;
      var listItem = coronadata.slice(0, size);


      for (i = 0; i < size; i++) {
        barChartData[i].push(listItem[i][0], Math.round(listItem[i][1] / 10000));
      }
      console.log(barChartData);


      anychart.theme('darkBlue');
      var dataset = anychart.data.set(barChartData);
      var mapping = dataset.mapAs({ x: 0, value: 1 });

      var chart = anychart.bar();

      var series = chart.bar(mapping);

    // Set point width.
    series.pointWidth(10);

      chart.title("Top 10 Countries Infected with Covid-19 in 10000s");
      // set the padding between bar groups
      chart.barGroupsPadding(0.2);


      chart.container("chart");

      chart.draw();
    }
  );

}


