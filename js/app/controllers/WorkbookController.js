function WorkbookController($scope, WorkbookService) {
  $scope.read = (workbook) => {
    WorkbookService.read(workbook);
    $scope.$apply();
  }
  $scope.error = (err) => console.log(err);
}

angular
  .module('tsa')
  .controller('WorkbookController', WorkbookController)
