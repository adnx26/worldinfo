/*
  Script to generate Map and Charts using GIS COVID Data
  Author : Advaith Nair
  Code Last Updated : June 21, 2020
  Copyright 2020 www.advaithn.com
*/



var map;

anychart.onDocumentReady(drawCoronaMap(), drawBarChart());

function drawCoronaMap() {
  // set chart theme
  anychart.theme('darkBlue');
  anychart.data.loadJsonFile(
    // The data is recived from the ESRI website https://www.esri.com/en-us/covid-19/overview
    'https://raw.githubusercontent.com/adnx26/worldinfo/master/testFileCSVJSON.json',
    function (data) {
      var coronadata = [];

      var tempArr = [];

      console.log(data)


      for (i = 0; i < data.length; i++) {

        tempArr[0] = String(data[i].Country_Region);
        tempArr[1] = parseInt(data[i].Confirmed);
        if (isNaN(tempArr[1])){
          tempArr[1] = 0;
        }
        tempArr[2] = parseInt(data[i].Deaths);
        if (isNaN(tempArr[2])){
          tempArr[2] = 0;
        }
        tempArr[3] = parseInt(data[i].Recovered);
        if (isNaN(tempArr[3])){
          tempArr[3] = 0;
        }
        tempArr[4] = parseFloat(data[i].Lat);
        tempArr[5] = parseFloat(data[i].Long_);
        tempArr[6] = parseInt(data[i].Last_Update);

        coronadata[i] = tempArr;
        tempArr = [];
      }

      //Sort Data by Conformed Rate
      coronadata.sort((a, b) => b[1] - a[1]);
      map = anychart.map();
      var d = new Date(coronadata[0][6]);

      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      today = mm + '/' + dd + '/' + yyyy;
      var newDate = today;


      // set map title and title settings
      

      // Sets geodata using https://cdn.anychart.com/geodata/2.0.0/custom/world/world.js
      map.geoData('anychart.maps.world');

      console.log(coronadata);



      //Get total infection rate
      totalInf = coronadata.map(coronadata => coronadata[1]).reduce((prev, next) => prev + next);
      totalDeath = coronadata.map(coronadata => coronadata[2]).reduce((prev, next) => prev + next);
      
      totalRecov = coronadata.map(coronadata => coronadata[3]).reduce((prev, next) => prev + next);
      console.log(totalRecov);
      
      totalInf = totalInf.toLocaleString();
      totalDeath = totalDeath.toLocaleString();
      totalRecov = totalRecov.toLocaleString();

      map
        .title()
        .enabled(true)
        .padding([10, 2, 10, 2])
        .text('Total Infected:'+ totalInf +  " | Total Deaths:" + totalDeath + '\nLast Updated ' + newDate);



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
      series.tooltip().format("{%size} Infected \n{%deaths} Death")

      // set chart bubble settings
      map.minBubbleSize('1%').maxBubbleSize('8%');

      // set bubble series settings
      series.fill('yellow .6').stroke('#333').selectionMode('multi-select');

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
      map.container('amap');
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
    'https://raw.githubusercontent.com/adnx26/worldinfo/master/testFileCSVJSON.json',

    function (data) {
      //Get Data from the ESRI website https://www.esri.com/en-us/covid-19/overview


      var usCount = 0;
      var usCountDead = 0;
      var usCountRecover = 0;

      var coronadata = [];

      var tempArr = [];
      for (i = 0; i < data.length; i++) {

        tempArr[0] = String(data[i].Country_Region);
        tempArr[1] = parseInt(data[i].Confirmed);
        tempArr[2] = parseInt(data[i].Deaths);
        tempArr[3] = parseInt(data[i].Recovered);
        tempArr[4] = parseFloat(data[i].Lat);
        tempArr[5] = parseFloat(data[i].Long_);
        tempArr[6] = parseInt(data[i].Last_Update);


        if(data[i].Country_Region == "US"){
          usCount += data[i].Confirmed;
          usCountDead += data[i].Deaths;
          usCountRecover += data[i].Recovered;
        }

        coronadata[i] = tempArr;
        tempArr = [];
      }

      coronadata.push(["United States", usCount, usCountDead])

      //Sort Data by Conformed Rate
      coronadata.sort((a, b) => b[1] - a[1]);


      var barChartData = [
        [], [], [], [], [], [], [], [], [], []
      ]


      var size = 10;
      var listItem = coronadata.slice(0, size);


      for (i = 0; i < size; i++) {
        barChartData[i].push(listItem[i][0], listItem[i][1], listItem[i][2], listItem[i][3]);
      }


      anychart.theme('darkBlue');


      var dataSet = anychart.data.set(barChartData);

      // map data for the first series, take x from the zero column and value from the first column of data set
      var firstSeriesData = dataSet.mapAs({ x: 0, value: 1 });

      // map data for the second series, take x from the zero column and value from the second column of data set
      var secondSeriesData = dataSet.mapAs({ x: 0, value: 3 });

      // map data for the second series, take x from the zero column and value from the third column of data set
      var thirdSeriesData = dataSet.mapAs({ x: 0, value: 2 });


      // create bar chart
      var chart = anychart.bar();

      // turn on chart animation
      chart.animation(false);



      chart.padding([10, 40, 5, 20]);

      // set chart title text settings
      chart.title('Top 10 Infected Countries');

      // set scale minimum
      chart.yScale().minimum(0);

      // force chart to stack values by Y scale.
      chart.yScale().stackMode('value');
      chart.yAxis().labels().format('{%Value}{groupsSeparator: }');

      // set titles for axises
      chart.xAxis().title('Country');
      chart.yAxis().title('');

      // helper function to setup label settings for all series
      var setupSeries = function (series, name) {
        series.name(name);
        series.stroke('3 #fff 1');
        series.hovered().stroke('3 #fff 1');
      };

      // temp variable to store series instance
      var series;

      // create first series with mapped data
      series1 = chart.bar(firstSeriesData);
      setupSeries(series1, 'Infected');
      series1.normal().fill("#ffff66", 1)
      series1.hovered().fill("#ffff66", 0.5);
      series1.selected().fill("#ffff66", 1);
      series1.normal().stroke("#ffff66", 1, "1 1", "round");
      series1.hovered().stroke("#ffff66", 2, "1 1", "round");
      series1.selected().stroke("#ffff66  ", 4, "1 1", "round");

      // create second series with mapped data
      series2 = chart.bar(secondSeriesData);
      setupSeries(series2, 'Recovered');
      series2.normal().fill("#33cc33", 1)
      series2.hovered().fill("#33cc33", 0.5);
      series2.selected().fill("#33cc33", 1);
      series2.normal().stroke("#33cc33", 1, "1 1", "round");
      series2.hovered().stroke("#33cc33", 2, "1 1", "round");
      series2.selected().stroke("#33cc33", 4, "1 1", "round");

      // create third series with mapped data
      series3 = chart.bar(thirdSeriesData);
      setupSeries(series3, 'Death');
      series3.normal().fill("#e60000", 1)
      series3.hovered().fill("#e60000", 0.5);
      series3.selected().fill("#e60000", 1);
      series3.normal().stroke("#e60000", 1, "1 1", "round");
      series3.hovered().stroke("#e60000", 2, "1 1", "round");
      series3.selected().stroke("#e60000", 4, "1 1", "round");

      //Bar settings
      var labels = chart.xAxis().labels();
      labels.enabled(true);
      labels.fontFamily("Courier");
      labels.fontSize(10);
      labels.useHtml(false);
      labels.width(55);
      labels.wordWrap("break-word");
      labels.wordBreak("break-all");
      labels.hAlign("right");

      var xAxis = chart.xAxis();
      xAxis.overlapMode("allowOverlap");


      // turn on legend
      chart.legend().enabled(true).fontSize(13).padding([0, 0, 20, 0]);

      chart.interactivity().hoverMode('by-x');
      chart.tooltip().valuePrefix('').displayMode('union');




      // Set point width.
      series1.pointWidth(10);
      series2.pointWidth(10);
      series3.pointWidth(10);

      //chart.title("Top 10 Countries Infected with Covid-19 in 10000s");
      // set the padding between bar groups
      chart.barGroupsPadding(0.1);

      chart.container("achart");

      chart.draw();
    }
  );

}
