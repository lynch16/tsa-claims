function GraphController($scope, ClaimsDataService, GraphService) {
  let ctrl = this;

  //ctrl.type
  ctrl.loadGraph = () => {
    if (ctrl.values.claims !== null) {
      ctrl.years = ctrl.values.years;
      ctrl.selectedYear = ctrl.selectedYear || ctrl.years[1];
      ctrl.series = GraphService.setSeries(parseData());
      ctrl.data = GraphService.setData(ctrl.labels, parseData()); //send labels & data
    }
  }

  ctrl.$onInit = () => {
    ctrl.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
  }

  const parseData = () => {
    let chartData = []
    if (ctrl.type === 'line') {
      let airlines = Object.keys(ctrl.values.avgTotalLoss)
      airlines.forEach( (airline) => {
        if (!!ctrl.values.avgTotalLoss[airline][ctrl.selectedYear]){ //if data for that airline exists
          chartData.push( {[airline]: (ctrl.values.avgTotalLoss[airline][ctrl.selectedYear])} );
        }
      })
    }
    return chartData; //array of objects [ {Airline: ClaimVal } ]
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
