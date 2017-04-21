angular
  .module('tsa', ['ngMaterial', 'ngMessages', 'angular-js-xlsx'])
  .run(function(WorkbookService){
    WorkbookService.loadLocalData();
  })
