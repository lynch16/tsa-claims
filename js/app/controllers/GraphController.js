function GraphController($timeout, ClaimsDataService, GraphService) {
  this.values = ClaimsDataService.getData();

  this.loadGraph = () => {
    if (this.values.claims !== null) {
      this.years = Object.keys(this.values.avgTotalLoss);
      let data = [
        { 'Global Avg Loss': Object.values(this.values.avgTotalLoss[this.selectedYear || this.years[0]]) }
      ]
      this.series = GraphService.setSeries(data);
      this.data = GraphService.setData(data);
    }
  }

  this.$onInit = () => {
    this.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.datasetOverride = [{ yAxisID: 'y-axis-1' }];
    this.options = {
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

  $timeout(() => {
    if(this.values.claims !== null) {
      this.loadGraph();
    }
  }, 500);
}

angular
  .module('tsa')
  .controller('GraphController', GraphController)
