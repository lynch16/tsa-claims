function GraphController($filter, ClaimsDataService, GraphService) {
  let ctrl = this;

  //ctrl.type

  ctrl.loadGraph = () => {
    if (ctrl.values.claims !== null) {
      let groupedData = $filter('groupBy')(ctrl.values.claims, 'Airline Name' );  //returns grouped object, insert type here

      let dates = Object.keys($filter('groupBy')(ctrl.values.claims, 'Incident Date'));
      dates.sort((a, b) => {
        date1 = new Date(parseInt(a));
        date2 = new Date(parseInt(b));
        if (date1 > date2) return 1;
        if (date2 > date1) return -1;
        return 0
      });
      let min = jStat.min(dates)
      let max = jStat.max(dates)

      dateRange = GraphService.allDatesInRange(min, max); //array of ms dates
      // ctrl.selectedYear = ctrl.selectedYear || ctrl.years[0]
      let data = [];
      for (let groupKey in groupedData) {
        let orderedGroup = $filter('groupBy')(groupedData[groupKey], 'Incident Date');  //order data by date for chart
        if (!!orderedGroup) {
          dateRange.forEach((d) => {
            if (!orderedGroup[d]) return;
            orderedGroup[d] = orderedGroup[d].map((claim) => {
              let val = parseFloat( claim['Close Amount'].replace('$', "").trim() );
              if (isNaN(val)) return 0;
              return val;
            });
          });
          if (groupKey === '-') {
            groupKey = 'Unknown';
          }
          data.push({ [groupKey]: orderedGroup }); //need one more filter here for just values of desired field
        }
      }

      ctrl.labels = GraphService.setLabels(dateRange);
      ctrl.series = GraphService.setSeries(data);
      ctrl.data = GraphService.setData(dateRange, data);
    }
  }

  ctrl.$onInit = () => {
    // ctrl.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
