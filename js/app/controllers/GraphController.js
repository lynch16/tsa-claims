function GraphController($filter, ClaimsDataService, GraphService) {
  let ctrl = this;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  ctrl.$onInit = () => {
    ctrl.values = ClaimsDataService.getData();
    if (ctrl.type === 'line'){
      ctrl.groupType = ctrl.groupType || "Airline Name" //default grouping for each graph
    } else {
      ctrl.groupType = ctrl.groupType || "Airport Code"
    }
    ctrl.groupOptions = Object.keys(ctrl.values.claims[0])

    let groupedData = $filter('groupBy')(ctrl.values.claims, ctrl.groupType );  //returns object containing claims grouped by 2nd param
    ctrl.allSeries = Object.keys(groupedData);
    ctrl.keys = [];

    ctrl.newClaim = {}
    ctrl.groupOptions.forEach((option) => {
      ctrl.newClaim[option] = "";
    });
    ctrl.checkAll();
    ctrl.loadGraph(groupedData);
  }

  ctrl.refreshGraph = () => {
    let groupedData = $filter('groupBy')(ctrl.values.claims, ctrl.groupType );  //returns object containing claims grouped by 2nd param
    ctrl.allSeries = Object.keys(groupedData);
    ctrl.loadGraph(groupedData);
  }

  ctrl.regroup = () => {
    let groupedData = $filter('groupBy')(ctrl.values.claims, ctrl.groupType );  //returns object containing claims grouped by 2nd param
    ctrl.allSeries = Object.keys(groupedData);
    ctrl.checkAll();
    ctrl.loadGraph(groupedData);
  }

  ctrl.addData = () => {
    for (let option in ctrl.newClaim) {
      ctrl.newClaim['Claim Number'] = Math.random().toString().slice(2,15)
      if (ctrl.newClaim[option] === "") {
        ctrl.newClaim[option] = "Unknown"
      }
    }
    ctrl.values.claims.push(ctrl.newClaim);
    ctrl.regroup();
    console.log('New Claim Saved!');
  }

  ctrl.checkAll = () => {
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

  ctrl.addAverages = (configuredData) => {
    let filteredData = $filter('selectKeys')(configuredData, ctrl.allSeries);
    let data;
    if (ctrl.type === 'line-average') {
      data = GraphService.setValueAverages(months, filteredData)
    } else {
      data = GraphService.setTotalValues(ctrl.dateRange, filteredData);
    }
    let  averages = []  //calculate averages across all keys
    for (let i = 0; i < ctrl.labels.length; i++) {
      let vals = []
      data.forEach((dataset) => {
        vals.push(parseFloat(dataset[i]));
      });
      averages.push(jStat.mean(vals).toFixed(2))
    }
    ctrl.data.push(averages);
    ctrl.series.push("Average (All " + ctrl.groupType + "s)");
  }

  ctrl.loadGraph = (groupedData) => {
    if (ctrl.values.claims !== null) {
      ctrl.dateRange = GraphService.loadDateRange(ctrl.values.claims); //gather date range for all dates within dataset
      let configuredData  = GraphService.configureValues(groupedData) //[ {[airline name]: { [month]: [claimValue, claimValue] }}, ... ]
      let filteredData = $filter('selectKeys')(configuredData, ctrl.keys); //only display desired keys

      let data;
      if (ctrl.type === 'line' || ctrl.type === 'line-average') {
        if (ctrl.type === 'line-average') {
          ctrl.labels = months;
          data = GraphService.setValueAverages(ctrl.labels, filteredData);
          if (data.length > 0) {
            ctrl.data = data[0];
          } else {
            ctrl.data = [[0]]
          }
        } else {
          ctrl.labels = GraphService.setLabels(ctrl.dateRange);
          ctrl.data = GraphService.setTotalValues(ctrl.dateRange, filteredData);
        }
        ctrl.series = GraphService.setSeries(filteredData);
        ctrl.addAverages(configuredData);
        ctrl.options = {
          title: {
            display: true,
            text: (ctrl.type === 'line') ? 'Total Values Per Month' : 'Average Values Per Month',
            fontSize: 16
          },
          scales: {
            yAxes: [{
              ticks: {
                callback: (value) => {
                  return '$' + value;
                }
              },
              scaleLabel: {
                display: true,
                labelString: (ctrl.type === 'line') ? 'Total Claim Values' : 'Average Claim Values',
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
              if (tooltipItem.yLabel > 0) return tooltipItem
              return
            },
            callbacks: {
              title: (tooltipItems) => {
                let month = tooltipItems[0].xLabel.split(", ") || tooltipItems[0].xLabel;
                if (month.length === 1) return tooltipItems[0].xLabel;
                return months[month[0]-1] + ", " + month[1];
              },
              label: (tooltipItem) => {

                return ctrl.series[tooltipItem.datasetIndex] + ": $" + tooltipItem.yLabel;
              }
            }
          }
        }
      }
      else if (ctrl.type === 'bar') {
        ctrl.labels = months;
        ctrl.series = GraphService.setSeries(filteredData);

        data = GraphService.setCountAverages(ctrl.labels, filteredData)
        if (data[0].length > 0) {
          ctrl.data = data[0]
        } else {
          ctrl.data = [[0]]
        }
        ctrl.options = {
          title: {
            display: true,
            text: 'Average Claims Per Month',
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
              if (tooltipItem.yLabel > 0) return tooltipItem
              return
            },
            callbacks: {
              label: (tooltipItem) => {
                let avgLabel = ctrl.series[tooltipItem.datasetIndex] + ": Average " + tooltipItem.yLabel
                let stdevLabel = "StdDev " + data[1][tooltipItem.datasetIndex][tooltipItem.index]
                return avgLabel + " | " + stdevLabel;
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
