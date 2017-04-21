function OneCtrl($scope, ClaimsDataService) {
  $scope.values = ClaimsDataService.getData();
}

angular
  .module('tsa')
  .controller('OneCtrl', OneCtrl)
