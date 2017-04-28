function TabsController($scope, ClaimsDataService) {

  let tabs = [
      { title: 'Total Value', content: 'line' },
      { title: 'Average # Claims', content: 'bar' },
      { title: 'Average $ Claims', content: 'line-average' }
    ],
    selected = null,
    previous = null;
  $scope.tabs = tabs;
  $scope.selectedIndex = 1;
  $scope.$watch('selectedIndex', (current, old) => {
    previous = selected;
    selected = tabs[current];
  });
}

angular
  .module('tsa')
  .controller('TabsController', TabsController)
