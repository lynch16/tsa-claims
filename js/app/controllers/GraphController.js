function GraphController($filter, ClaimsDataService, GraphService) {
  let ctrl = this;

  ctrl.loadGraph = () => {
    if (ctrl.values.claims !== null) {
      if (ctrl.type === 'line'){
        ctrl.filterType = ctrl.filterType || "Airline Name"
      } else {
        ctrl.filterType = ctrl.filterType || "Airport Code"
      }
      let dateRange = loadDateRange(); //gather date range for all dates within dataset
      let groupedData = $filter('groupBy')(ctrl.values.claims, ctrl.filterType );  //returns object containing claims grouped by 2nd param
      let configuredData  = GraphService.configureValues(groupedData) //[ {[airline name]: { [month]: [claimValue, claimValue] }}, ... ]

      if (ctrl.type === 'line') {
        ctrl.labels = GraphService.setLabels(dateRange);
        ctrl.data = GraphService.setTotalValues(dateRange, configuredData);
      } else if (ctrl.type === 'bar') {
        ctrl.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        ctrl.data = GraphService.setCountAverages(ctrl.labels, configuredData)[0];
      }

      let series = GraphService.setSeries(configuredData);
      ctrl.series = series
    }
  }

  const loadDateRange = () => {
    let dates = Object.keys($filter('groupBy')(ctrl.values.claims, 'Incident Date'));
    dates.sort((a, b) => {
      date1 = new Date(parseInt(a));
      date2 = new Date(parseInt(b));
      if (date1 > date2) return 1;
      if (date2 > date1) return -1;
      return 0
    });
    let min = jStat.min(dates); //min of date range of claims
    let max = jStat.max(dates);
    let range = GraphService.allDatesInRange(min, max); //array of dates in milliseconds since epoch
    return range;
  }

  ctrl.$onInit = () => {
    ctrl.values = ClaimsDataService.getData();
    ctrl.filterOptions = Object.keys(ctrl.values.claims[0])
    ctrl.newClaim = {}
    ctrl.filterOptions.forEach((option) => {
      ctrl.newClaim[option] = "";
    });

    ctrl.datasetOverride = [{ yAxisID: 'y-axis-1' }];
    ctrl.options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
          }
        ]
      }
    }
    ctrl.loadGraph();
    ctrl.refreshGraph = () => {     //needed in order to call from view
      ctrl.loadGraph();
    }
    ctrl.addData = () => {
      ctrl.values.claims.push(ctrl.newClaim);
      ctrl.refreshGraph();
      console.log('New Claim Saved!');
    }
  }
}

angular
  .module('tsa')
  .controller('GraphController', GraphController)
