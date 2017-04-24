angular
  .module('tsa', ['ui.router', 'ngMaterial', 'ngMessages', 'angular-js-xlsx', 'chart.js'])
  .config(($stateProvider, $urlRouterProvider) => {

    $stateProvider
      .state('root', {
        url: '/',
        template: '<customgraph type="{{tab.content}}"></customgraph>',
        resolve: {
          values: (ClaimsDataService) => {
            return ClaimsDataService.waitData();
          }
        }
      })
      $urlRouterProvider.otherwise('/')

  })
  .run(function(WorkbookService){
    WorkbookService.loadLocalData('data/claims-2014.xls');
  })
