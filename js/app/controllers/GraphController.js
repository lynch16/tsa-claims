function GraphController($scope, ClaimsDataService){

  const setSeries = (data) => {
    let series = []
    data.forEach((entry) => {
      for (let key in entry) {
        series.push(key);
      }
    });
    return series;
  }

  const setData = (data) => {
    let results = [];
    data.forEach((lineGraph) => {
      for (let key in lineGraph) {
        results.push(lineGraph[key])
      }
    });
     return results
  }

  $scope.values = ClaimsDataService.getData();
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
  $scope.options = {
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

  $scope.loadGraph = () => {
    if ($scope.values.claims !== null) {
      $scope.years = Object.keys($scope.values.avgTotalLoss);

      let data = [
        { 'Global Avg Loss': Object.values($scope.values.avgTotalLoss[$scope.selectedYear || $scope.years[0]]) }
      ]
      $scope.series = setSeries(data);
      $scope.data = setData(data);
    }
  }

  $scope.$watch('values', (current, old) => {
    if (current !== old) { $scope.loadGraph() }
  }, true);


}
angular
  .module('tsa')
  .controller('GraphController', GraphController)
