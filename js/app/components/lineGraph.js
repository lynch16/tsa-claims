const lineGraph = {
  bindings:  {
    values: '<'
  },
  controller: GraphController,
  controllerAs: 'ctrl',
  template: [
    '<select ng-model="ctrl.selectedYear" ng-options="x for x in ctrl.years" ng-change="ctrl.loadGraph()"></select>',
      '<canvas id="line" class="chart chart-line" chart-data="ctrl.data" chart-labels="ctrl.labels"',
      'chart-series="ctrl.series" chart-options="ctrl.options" chart-dataset-override="ctrl.datasetOverride">',
    '</canvas>',
  ].join('')
}

angular
  .module('tsa')
  .component('lineGraph', lineGraph)
