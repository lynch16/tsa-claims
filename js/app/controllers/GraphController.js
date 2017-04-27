function GraphController($filter, ClaimsDataService, GraphService) {
  let ctrl = this;

  //ctrl.type

  ctrl.loadGraph = () => {
    if (ctrl.values.claims !== null) {

      let dates = Object.keys($filter('groupBy')(ctrl.values.claims, 'Incident Date', ctrl.rangeType));
      dates.sort((a, b) => {
        date1 = new Date(parseInt(a));
        date2 = new Date(parseInt(b));
        if (date1 > date2) return 1;
        if (date2 > date1) return -1;
        return 0
      });
      let min = jStat.min(dates)
      let max = jStat.max(dates)
      let dateRange = GraphService.allDatesInRange(min, max, ctrl.rangeType); //array of dates in milliseconds since epoch

      let groupedData = $filter('groupBy')(ctrl.values.claims, 'Airline Name' );  //returns grouped object
      let configuredData  = GraphService.configureValues(groupedData, ctrl.rangeType) //[ {[airline name]: { [month]: [claimValue, claimValue] }}, ... ]
      // ctrl.selectedYear = ctrl.selectedYear || ctrl.years[0]

      let labels = GraphService.setLabels(dateRange, ctrl.rangeType);
      let series = GraphService.setSeries(configuredData);
      let data = GraphService.setData(dateRange, configuredData);
      ctrl.labels = labels
      ctrl.series = series
      ctrl.data = data
    }
  }

  ctrl.$onInit = () => {
    ctrl.ranges = ["month", "year"]
    // ctrl.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
    ctrl.values = ClaimsDataService.getData();
    ctrl.loadGraph();
    ctrl.refreshGraph = () => {
      ctrl.loadGraph();
    }
  }

  //
  // ctrl.$onChanges = () => {
  //   console.log('change');
  //   ctrl.values = ClaimsDataService.getData();
  //   ctrl.loadGraph();
  // }
}

angular
  .module('tsa')
  .controller('GraphController', GraphController)
