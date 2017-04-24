function GraphController($filter, ClaimsDataService, GraphService) {
  let ctrl = this;

  //ctrl.type

  ctrl.loadGraph = () => {
    if (ctrl.values.claims !== null) {
      let groupedData = $filter('groupBy')(ctrl.values.claims, 'Airline Name' );  //returns grouped object, insert type here

      ctrl.years = Object.keys($filter('groupBy')(ctrl.values.claims, 'Incident Date'))
      ctrl.selectedYear = ctrl.selectedYear || ctrl.years[2]
      groupedData = gatherClaimValues(groupedData)
      let data = []
      for ( let group in groupedData ) {
        if (!!groupedData[group][ctrl.selectedYear]){
          data.push( {[group]: groupedData[group][ctrl.selectedYear]} );
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
  }

  const gatherClaimValues = (groupedData) => {
    let result = {}
    for (let groupKey in groupedData) {
      let orderedGroup = $filter('groupBy')(groupedData[groupKey], 'Incident Date');  //order data by date for chart
      for (let year in orderedGroup){
        for (let month in orderedGroup[year]) {
          let claimValues = []
          for (let i = 0; i < orderedGroup[year][month].length; i++){
            let val = parseFloat( orderedGroup[year][month][i]['Close Amount'].replace('$', "").trim() )
            if (val > 0) {
              claimValues.push(val);
            }
          }
          if (claimValues.length > 0){
            let avg = claimValues.reduce( (total, amt, index, array) => { //find average of that airline's monthly claim value
              total += amt;
              if (index === array.length-1){
                return (total/array.length).toFixed(2)/1; //toFixed makes strings from floating decimals.
                                                          //divide by 1 to make them numbers gain
              } else {
                return total;
              }
            });
            if (groupKey === '-'){ //Fix '-' fields
              groupKey = 'Unknown';
            }
            if (!result[groupKey]){
              result[groupKey] = {
                [year]: {
                  [month]: avg
                }
              }
            } else if (!result[groupKey][year]) {
              result[groupKey][year] = {
                  [month]: avg
              }
            } else {
              result[groupKey][year][month] = avg
            }
          }
        }
      }
    }
    return result;
  }


  const parseData = () => {
    let chartData = []
    if (ctrl.type === 'line') {
      let airlines = Object.keys(ctrl.values.avgTotalLoss)
      airlines.forEach( (airline) => {
        if (!!ctrl.values.avgTotalLoss[airline][ctrl.selectedYear]){ //if data for that airline exists
          chartData.push( {[airline]: (ctrl.values.avgTotalLoss[airline][ctrl.selectedYear])} );
        }
      })
    }
    return chartData; //array of objects [ {Airline: ClaimVal } ]
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
