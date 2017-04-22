angular
  .module('tsa', ['ngMaterial', 'ngMessages', 'angular-js-xlsx', 'chart.js'])
  .run(function(WorkbookService){
    WorkbookService.loadLocalData();
  })
