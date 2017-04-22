function GraphController($scope, ClaimsDataService){
  $scope.values = ClaimsDataService.getData();
  $scope.years = [];
  $scope.selectedYear = '2014';
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"];
  $scope.series = ['Series A'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
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
  $scope.updateGraph = () => {
    if ($scope.values.claims !== null) {
      $scope.years = Object.keys(ClaimsDataService.getData().avgTotalLoss);
      $scope.data = Object.values(ClaimsDataService.getData().avgTotalLoss[$scope.selectedYear]);
      console.log($scope.years);
      console.log($scope.data);
    }
  }
  $scope.$watch('values', (current, old) => {
    $scope.updateGraph();
  }, true);
}
angular
  .module('tsa')
  .controller('GraphController', GraphController)
