const lineGraph = {
  controller: GraphController,
  controllerAs: 'ctrl',
  bindings: {
    data: "<",
    labels: "<",
    series: "<"
  },
  templateurl: 'graph.html'
}

angular
  .module('tsa')
  .component('lineGraph', lineGraph)
