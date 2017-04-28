angular
  .module('tsa', ['ui.router', 'ngMaterial', 'ngMessages', 'angular-js-xlsx', 'chart.js'])
  .config(($stateProvider, $urlRouterProvider) => {

    $stateProvider
      .state('root', {
        url: '/',
        templateUrl: 'views/tabs.html',
        controller: 'TabsController as tabs'
      })
      $urlRouterProvider.otherwise('/');
  })
  .run(function(WorkbookService){
    WorkbookService.loadLocalData('data/claims-2014.xls');
  })
