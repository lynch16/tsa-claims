function GraphController($filter, GraphService) {
  let ctrl = this;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  ctrl.$onInit = () => {
    if (ctrl.type === 'line'){
      ctrl.groupType = ctrl.groupType || "Airline Name"; //default grouping for each graph
    } else {
      ctrl.groupType = ctrl.groupType || "Airport Code";
    }
    ctrl.groupOptions = Object.keys(ctrl.values.claims[0]); //options for filtering the data

    let groupedData = $filter('groupBy')(ctrl.values.claims, ctrl.groupType);  //returns object containing claims grouped by 2nd param
    ctrl.allSeries = Object.keys(groupedData); //save all series seperately for filtering
    ctrl.keys = []; //keys to filter the views by

    ctrl.newClaim = {};
    ctrl.groupOptions.forEach((option) => { //make empty fields for all claim fields
      ctrl.newClaim[option] = "";
    });
    ctrl.checkAll(); //default all keys visiable
    ctrl.loadGraph(groupedData);
  }

  ctrl.refreshGraph = () => {
    let groupedData = $filter('groupBy')(ctrl.values.claims, ctrl.groupType); //make sure data is properly grouped before refreshing
    ctrl.allSeries = Object.keys(groupedData);
    ctrl.loadGraph(groupedData);
  }

  ctrl.regroup = () => { //before loading graph, re-enable all keys
    let groupedData = $filter('groupBy')(ctrl.values.claims, ctrl.groupType);
    ctrl.allSeries = Object.keys(groupedData);
    ctrl.checkAll();
    ctrl.loadGraph(groupedData);
  }

  ctrl.addClaim = () => {
    for (let option in ctrl.newClaim) {
      ctrl.newClaim['Claim Number'] = Math.random().toString().slice(2,15); //random 13 digit claim number
      if (ctrl.newClaim[option] === "") {
        ctrl.newClaim[option] = "Unknown";
      }
    }
    ctrl.values.claims.push(ctrl.newClaim);
    ctrl.regroup(); //if not regrouped, new claim will be defaulted filtered out
    console.log('New Claim Saved!');
  }

  ctrl.checkAll = () => { //undo all key filters
    ctrl.keys = angular.copy(ctrl.allSeries);
  }

  ctrl.uncheckAll = () => {
    ctrl.keys = [];
  }

  ctrl.toggleAllKeys = () => {
    if (ctrl.keys.length > 0){
      ctrl.uncheckAll();
    } else {
      ctrl.checkAll();
    }
    ctrl.refreshGraph();
  }

  ctrl.toggleKeys = (key) => {
    let indx = ctrl.keys.indexOf(key);
    if (indx > -1) {
      ctrl.keys.splice(indx, 1);
    } else {
      ctrl.keys.push(key);
    }
    ctrl.refreshGraph();
  }

  ctrl.calcStats = (configuredData) => { //add global averages to dataset
    ctrl.stats = [];
    let filteredData = $filter('selectKeys')(configuredData, ctrl.allSeries); //ignore key selection when calculating averages
    let data;
    let averages = [];  //calculate averages across all keys
    let stdDevs = [];
    if (ctrl.type === 'line') {
      data = GraphService.setTotalValues(ctrl.dateRange, filteredData);
    } else {
      data = GraphService.setCountAverages(ctrl.labels, filteredData)[0];
    }
    console.log(data);
    for (let i = 0; i < ctrl.labels.length; i++) {
      let vals = [];
      data.forEach((dataset) => {
        vals.push(parseFloat(dataset[i]));
      });
      averages.push(jStat.mean(vals).toFixed(2));
      stdDevs.push(jStat.stdev(vals).toFixed(2));
    }
    ctrl.data.push(averages);
    ctrl.series.push("Average (All " + ctrl.groupType + "s)");
    ctrl.stats.push(averages, stdDevs);
    console.log(ctrl.stats);
  }

  ctrl.loadGraph = (groupedData) => {
    if (ctrl.values.claims !== null) {
      ctrl.dateRange = GraphService.loadDateRange(ctrl.values.claims); //gather date range for all dates within dataset
      let configuredData  = GraphService.configureValues(groupedData); //[ {[airline name]: { [month]: [claimValue, claimValue] }}, ... ]
      let filteredData = $filter('selectKeys')(configuredData, ctrl.keys); //only display data from desired keys

      if (ctrl.type === 'line') {
        ctrl.labels = GraphService.setLabels(ctrl.dateRange);
        ctrl.data = GraphService.setTotalValues(ctrl.dateRange, filteredData);
        ctrl.series = GraphService.setSeries(filteredData);
        ctrl.calcStats(configuredData);
        ctrl.options = {
          title: {
            display: true,
            text: 'Total Values Per Month',
            fontSize: 16
          },
          scales: {
            yAxes: [{
              ticks: {
                callback: (value) => {
                  return '$' + value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  });
                }
              },
              scaleLabel: {
                display: true,
                labelString: 'Total Claim Values'
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Month'
              }
            }]
          },
          tooltips: {
            position: 'nearest',
            filter: (tooltipItem) => {
              if (tooltipItem.yLabel > 0) return tooltipItem; //hide tooltip for series with no data at selected point
              return;
            },
            itemSort: (a, b) => {
              return b.yLabel - a.yLabel;
            },
            callbacks: {
              title: (tooltipItems) => {
                let month = tooltipItems[0].xLabel.split(", ") || tooltipItems[0].xLabel;
                if (month.length === 1) return tooltipItems[0].xLabel;
                return months[month[0]-1] + ", " + month[1];
              },
              label: (tooltipItem) => {
                return ctrl.series[tooltipItem.datasetIndex] + ": $" +
                  tooltipItem.yLabel.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  });
              }
            }
          }
        }
      }
      else if (ctrl.type === 'bar') {
        ctrl.labels = months;
        ctrl.series = GraphService.setSeries(filteredData);

        let data = GraphService.setCountAverages(ctrl.labels, filteredData)
        if (data[0].length > 0) {
          ctrl.data = data[0];
        } else {
          ctrl.data = [[0]]; //set data to 0 if no averages returned so that graph doesn't hide
        }
        ctrl.calcStats(configuredData);
        ctrl.options = {
          title: {
            display: true,
            text: "Average Claims Per Month",
            fontSize: 16
          },
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Average Number of Claims'
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Month'
              }
            }]
          },
          tooltips: {
            position: 'nearest',
            filter: (tooltipItem) => {
              if (tooltipItem.yLabel > 0) return tooltipItem; //hide tooltip for series with no data at selected point
              return;
            },
            itemSort: (a, b) => {
              return b.yLabel - a.yLabel; //sort desc by average
            },
            callbacks: {
              label: (tooltipItem) => {
                let avgLabel = "Average " + tooltipItem.yLabel;
                let stdevLabel = "StdDev " + data[1][tooltipItem.datasetIndex][tooltipItem.index];
                return ctrl.series[tooltipItem.datasetIndex] + ": " + avgLabel + " | " + stdevLabel;
              }
            }
          }
        }
      }
    }
  }
}

angular
  .module('tsa')
  .controller('GraphController', GraphController)
