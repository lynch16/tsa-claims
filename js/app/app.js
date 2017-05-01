angular
  .module('tsa', ['ui.router', 'ngMaterial', 'ngMessages', 'angular-js-xlsx', 'chart.js'])
  .config(($stateProvider, $urlRouterProvider) => {

    $stateProvider
      .state('root', {
        url: '/',
        templateUrl: 'views/root.html',
        controller: 'TabsController as tabsCtrl',
        resolve: {
          values: (ClaimsDataService) => {
            return ClaimsDataService.waitData();
          }
        }
      })
      .state('about', {
        url: '/about',
        templateUrl: 'views/about.html',
      })
      $urlRouterProvider.otherwise('/');
  })
  .run(function(WorkbookService){
    WorkbookService.loadLocalData('data/claims-2010-2013_0.xls');
  })
