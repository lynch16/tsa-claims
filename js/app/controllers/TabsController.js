function TabsController($scope) {
  var tabs = [
      { title: 'One', content: 'Tab one content' },
      { title: 'Two', content: 'Tab two content' }
    ],
    selected = null,
    previous = null;
  $scope.tabs = tabs;
  $scope.selectedIndex = 1;
  $scope.$watch('selectedIndex', (current, old) => {
    previous = selected;
    selected = tabs[current];
  })
}
angular
  .module('tsa')
  .controller('TabsController', TabsController)
