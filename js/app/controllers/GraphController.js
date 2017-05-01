function GraphController($filter, $window, GraphService) {
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
    ctrl.newClaim['Claim Number'] = Math.random().toString().slice(2,15); //random 13 digit claim number
    for (let option in ctrl.newClaim) {
      if ((ctrl.newClaim[option] === "") && (option !== 'Claim Number')) {
        ctrl.newClaim[option] = "Unknown";
      }
    }
    ctrl.values.claims.push(angular.copy(ctrl.newClaim));
    ctrl.regroup(); //regroup or new input will likely be filtered out by default
    for (let option in ctrl.newClaim) { //clear form
      ctrl.newClaim[option] = "";
    }
    $window.alert('New Claim Saved!');
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

  ctrl.calcGlobalStats = (configuredData) => { //add global averages to dataset
    ctrl.globalStats = [];
    let data;
    let averages = [];  //calculate averages across all keys
    let stdDevs = [];
    if (ctrl.type === 'line') {
      data = GraphService.setTotalValues(ctrl.dateRange, configuredData);
    } else {
      data = GraphService.setCountAverages(ctrl.labels, configuredData)[0];
    }
    for (let i = 0; i < ctrl.labels.length; i++) {
      let vals = [];
      data.forEach((dataset) => {
        vals.push(parseFloat(dataset[i]));
      });
      averages.push(jStat.mean(vals).toFixed(2));
      stdDevs.push(jStat.stdev(vals).toFixed(2));
    }
    ctrl.globalStats.push(averages, stdDevs);
  }

  ctrl.calcLocalStats = (filteredData) => { //add global averages to dataset
    ctrl.localStats = []; //declare here so that it is rewritten with every filter.
    let data;
    let averages = [];  //calculate averages across all keys
    let stdDevs = [];
    if (ctrl.type === 'line') {
      data = GraphService.setTotalValues(ctrl.dateRange, filteredData);
    } else {
      data = GraphService.setCountAverages(ctrl.labels, filteredData)[0];
    }
    for (let i = 0; i < ctrl.labels.length; i++) {
      let vals = [];
      if (data.length === 0) {
        vals = [0];
      } else {
        data.forEach((dataset) => {
          vals.push(parseFloat(dataset[i]));
        });
      }
      averages.push(jStat.mean(vals).toFixed(2));
      stdDevs.push(jStat.stdev(vals).toFixed(2));
    }
    ctrl.localStats.push(averages, stdDevs);
  }

  ctrl.loadGraph = (groupedData) => {
    if (ctrl.values.claims !== null) {
      ctrl.statTabs = [ //define here so that it is refreshed with grouping changes
        { title: 'All ' + ctrl.groupType + "s",
          content: 'global',
        },
        { title: 'Filtered ' + ctrl.groupType + "s",
          content: 'local',
        }
      ]

      ctrl.dateRange = GraphService.loadDateRange(ctrl.values.claims); //gather date range for all dates within dataset
      let configuredData  = GraphService.configureValues(groupedData); //[ {[airline name]: { [month]: [claimValue, claimValue] }}, ... ]
      let filteredData = $filter('selectKeys')(configuredData, ctrl.keys); //only display data from desired keys

      if (ctrl.type === 'line') {
        ctrl.labels = GraphService.setLabels(ctrl.dateRange);
        let data = GraphService.setTotalValues(ctrl.dateRange, filteredData);
        if (data[0]) {
          ctrl.data = data;
        } else {
          ctrl.data = [[0]]; //set data to 0 if no averages returned so that graph doesn't hide
        }
        ctrl.series = GraphService.setSeries(filteredData);
        ctrl.calcGlobalStats(configuredData);
        ctrl.calcLocalStats(filteredData);
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
        ctrl.calcGlobalStats(configuredData);
        ctrl.calcLocalStats(filteredData);
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
