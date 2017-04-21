function TabsController($scope, ClaimsDataService) {
  $scope.values = ClaimsDataService.getData();

  let tabs = [
      { title: '$ Lost/Month', content: null },
      { title: 'Avg Claims/Month', content: null }
    ],
    selected = null,
    previous = null;
  $scope.tabs = tabs;
  $scope.selectedIndex = 1;
  $scope.$watch('selectedIndex', (current, old) => {
    previous = selected;
    selected = tabs[current];
  });
  $scope.$watch('values', (current, old) => {
    $scope.tabs[0].content = $scope.values.claims;
    $scope.tabs[1].content = $scope.values.months;
  }, true)
}

angular
  .module('tsa')
  .controller('TabsController', TabsController)
