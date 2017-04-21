function WorkbookController($scope, ClaimsDataService) {
  $scope.read = (workbook) => {
    workbook.SheetNames.forEach((sheetName) => {
      let jsonArray = XLS.utils.sheet_to_json(workbook.Sheets[sheetName]);
      if (jsonArray.length > 0){
        ClaimsDataService.loadData(jsonArray);
        console.log('data loaded');
        $scope.$apply();
      }
    });
  }
  $scope.error = (err) => console.log(err);
}

angular
  .module('tsa')
  .controller('WorkbookController', WorkbookController)
