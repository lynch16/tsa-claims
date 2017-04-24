function customgraph($compile) {
  return {
    restrict: 'E',
    controller: GraphController,
    controllerAs: 'ctrl',
    bindToController: {
      type: "@",
      data: "<",
      labels: "<",
      series: "<"
    },
    templateUrl: 'graph.html'
  }
}

angular
  .module('tsa')
  .directive('customgraph', customgraph)
