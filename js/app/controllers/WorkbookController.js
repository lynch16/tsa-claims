function WorkbookController($scope) {
  $scope.read = (workbook) => {
    var result = {};
    workbook.SheetNames.forEach((sheetName) => {
      var json = XLS.utils.sheet_to_json(workbook.Sheets[sheetName]);
      if (json.length > 0){
        result[sheetName] = json;
      }
    });
    console.log(result);
  }
  $scope.error = (err) => console.log(err);
}

angular
  .module('tsa')
  .controller('WorkbookController', WorkbookController)
