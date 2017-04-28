function GraphController($filter, ClaimsDataService, GraphService) {
  let ctrl = this;

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
    ctrl.loadGraph(groupedData);
  }

  ctrl.addData = () => {
    ctrl.values.claims.push(ctrl.newClaim);
    ctrl.refreshGraph();
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

  ctrl.loadGraph = (groupedData) => {
    if (ctrl.values.claims !== null) {
      let dateRange = GraphService.loadDateRange(ctrl.values.claims); //gather date range for all dates within dataset
      let configuredData  = GraphService.configureValues(groupedData) //[ {[airline name]: { [month]: [claimValue, claimValue] }}, ... ]
      let filteredData = $filter('selectKeys')(configuredData, ctrl.keys);

      if (ctrl.type === 'line') {
        ctrl.labels = GraphService.setLabels(dateRange);
        data = GraphService.setTotalValues(dateRange, filteredData);
        series = GraphService.setSeries(filteredData);

        let  averages = []  //calculate averages across all keys
        for (let i = 0; i < ctrl.labels.length; i++) {
          let vals = []
          data.forEach((dataset) => {
            vals.push(parseFloat(dataset[i]));
          });
          averages.push(jStat.mean(vals).toFixed(2))
        }
        data.push(averages);
        series.push("Global Average");
        ctrl.data = data;
        ctrl.series = series;

        ctrl.options = {
          title: {
            display: true,
            text: 'Total Values Per Month',
            fontSize: 16
          }
        }
      } else if (ctrl.type === 'bar') {
        ctrl.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        ctrl.series = GraphService.setSeries(filteredData);

        let data = GraphService.setCountAverages(ctrl.labels, filteredData);
        ctrl.data = data[0]
        ctrl.options = {
          title: {
            display: true,
            text: 'Average Claims Per Month',
            fontSize: 16
          }
        }
      }
    }
  }

  ctrl.$onChange = (changes) => {
    console.log("changes");
  }
}

angular
  .module('tsa')
  .controller('GraphController', GraphController)
