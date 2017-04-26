function GraphController($filter, ClaimsDataService, GraphService) {
  let ctrl = this;

  //ctrl.type

  ctrl.loadGraph = () => {
    if (ctrl.values.claims !== null) {
      let groupedData = $filter('groupBy')(ctrl.values.claims, 'Airline Name' );  //returns grouped object, insert type here
      groupedData = ClaimsDataService.valuesByMonth(groupedData)

      ctrl.years = Object.keys($filter('groupBy')(ctrl.values.claims, 'Incident Date'))
      ctrl.selectedYear = ctrl.selectedYear || ctrl.years[0]
      if(ctrl.type === 'line'){
        groupedData = groupedData['values']
      } else {
        groupedData = ClaimsDataService.valuesByMonth(groupedData)[1]
      }
      let data = []
      for ( let group in groupedData ) {
        if (!!groupedData[group][ctrl.selectedYear]){                    //if there is data for selected group this year
          data.push( {[group]: groupedData[group][ctrl.selectedYear]} ); //add data object to array of data
                                                                         //(eg. {'Southwest'}: [{'0': 56.4}, {'1': 988.74}, ...] )
        }
      }
      ctrl.series = GraphService.setSeries(data);
      ctrl.data = GraphService.setData(ctrl.labels, data);
    }
  }

  ctrl.$onInit = () => {
    ctrl.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    ctrl.datasetOverride = [{ yAxisID: 'y-axis-1' }];
    ctrl.options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
          }
        ]
      }
    }
    ctrl.values = ClaimsDataService.getData();
    ctrl.loadGraph();
    ctrl.refreshGraph = () => {
      ctrl.loadGraph();
    }
  }

  //
  // ctrl.$onChanges = () => {
  //   console.log('change');
  //   ctrl.values = ClaimsDataService.getData();
  //   ctrl.loadGraph();
  // }
}

angular
  .module('tsa')
  .controller('GraphController', GraphController)
