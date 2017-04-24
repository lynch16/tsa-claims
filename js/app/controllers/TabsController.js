function TabsController($scope, ClaimsDataService) {

  let tabs = [
      { title: '$ Lost/Month', content: 'line' },
      { title: 'Avg Claims/Month', content: 'bar' }
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
