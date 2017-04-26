function GraphController($filter, ClaimsDataService, GraphService) {
  let ctrl = this;

  //ctrl.type

  ctrl.loadGraph = () => {
    if (ctrl.values.claims !== null) {
      let groupedData = $filter('groupBy')(ctrl.values.claims, 'Airline Name' );  //returns grouped object, insert type here
      ctrl.labels = Object.keys($filter('groupBy')(ctrl.values.claims, 'Incident Date'))
      // ctrl.selectedYear = ctrl.selectedYear || ctrl.years[0]

      let data = [];
      for (let groupKey in groupedData) {
        let orderedGroup = $filter('groupBy')(groupedData[groupKey], 'Incident Date');  //order data by date for chart
        if (!!orderedGroup) {
          for (let month in orderedGroup) {
            orderedGroup[month] = orderedGroup[month].map((claim) => {
              let val = parseFloat( claim['Close Amount'].replace('$', "").trim() )
              if (isNaN(val)) return 0
              return val
            });
          }
          data.push({ [groupKey]: orderedGroup }); //need one more filter here for just values of desired field
        }
      }

      ctrl.series = GraphService.setSeries(data);
      ctrl.data = GraphService.setData(ctrl.labels, data);
      console.log(ctrl.data);
    }
  }

  ctrl.$onInit = () => {
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
