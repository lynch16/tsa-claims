function GraphController($scope, ClaimsDataService, GraphService) {
  let ctrl = this;

  ctrl.loadGraph = () => {
    if (ctrl.values.claims !== null) {
      ctrl.years = Object.keys(ctrl.values.avgTotalLoss);
      let data = [
        { 'Global Avg Loss': Object.values(ctrl.values.avgTotalLoss[ctrl.selectedYear || ctrl.years[0]]) }
        // { 'Global Avg Loss': Object.values(ctrl.values.avgTotalLoss[ctrl.selectedYear || ctrl.years[0]]) }
      ]
      ctrl.series = GraphService.setSeries(data);
      ctrl.data = GraphService.setData(data);
    }
  }

  ctrl.$onInit = () => {
    ctrl.values = ClaimsDataService.getData();
    ctrl.loadGraph();
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
  }

  ctrl.$onChanges = () => {
    console.log('change');
    ctrl.values = ClaimsDataService.getData();
    ctrl.loadGraph();
  }
}

angular
  .module('tsa')
  .controller('GraphController', GraphController)
