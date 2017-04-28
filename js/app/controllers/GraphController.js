function GraphController($filter, ClaimsDataService, GraphService) {
  let ctrl = this;

  ctrl.loadGraph = () => {
    if (ctrl.values.claims !== null) {
      if (ctrl.type === 'line'){
        ctrl.groupType = ctrl.groupType || "Airline Name" //default grouping for each graph
      } else {
        ctrl.groupType = ctrl.groupType || "Airport Code"
      }
      let dateRange = GraphService.loadDateRange(ctrl.values.claims); //gather date range for all dates within dataset
      let groupedData = $filter('groupBy')(ctrl.values.claims, ctrl.groupType );  //returns object containing claims grouped by 2nd param
      let configuredData  = GraphService.configureValues(groupedData) //[ {[airline name]: { [month]: [claimValue, claimValue] }}, ... ]
      ctrl.allSeries = GraphService.setSeries(configuredData);
      ctrl.keys = [];
      ctrl.checkAll = () => {
        ctrl.keys = angular.copy(ctrl.allSeries);
      }
      ctrl.uncheckAll = () => {
        ctrl.keys = [];
      }

      let filteredData = $filter('selectKeys')(configuredData, ctrl.keys);

      if (ctrl.type === 'line') {
        ctrl.labels = GraphService.setLabels(dateRange);
        data = GraphService.setTotalValues(dateRange, filteredData);
        series = GraphService.setSeries(filteredData);

        let  averages = []  //calculate averages across all keys
        for (let i = 0; i < ctrl.labels.length; i++) {
          let vals = []
          data.forEach((dataset) => {
            vals.push(parseFloat(dataset[i]));
          });
          averages.push(jStat.mean(vals).toFixed(2))
        }
        data.push(averages);
        series.push("Global Average");
        ctrl.data = data;
        ctrl.series = series;

        ctrl.options = {
          title: {
            display: true,
            text: 'Total Values Per Month',
            fontSize: 16
          }
        }
      } else if (ctrl.type === 'bar') {
        ctrl.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        ctrl.series = GraphService.setSeries(filteredData);

        let data = GraphService.setCountAverages(ctrl.labels, filteredData);
        ctrl.data = data[0]
        ctrl.options = {
          title: {
            display: true,
            text: 'Average Claims Per Month',
            fontSize: 16
          }
        }
      }
    }
  }

  ctrl.$onInit = () => {
    ctrl.values = ClaimsDataService.getData();
    ctrl.groupOptions = Object.keys(ctrl.values.claims[0])
    ctrl.newClaim = {}
    ctrl.groupOptions.forEach((option) => {
      ctrl.newClaim[option] = "";
    });
    ctrl.loadGraph();
    ctrl.refreshGraph = () => {     //needed in order to call from view
      ctrl.loadGraph();
    }
    ctrl.addData = () => {
      ctrl.values.claims.push(ctrl.newClaim);
      ctrl.refreshGraph();
      console.log('New Claim Saved!');
    }
  }

  ctrl.$onChange = (changes) => {
    console.log("changes");
  }

  ctrl.toggleKeys = (key) => {
    console.log(key);
    let indx = ctrl.keys.indexOf(key);
    if (indx > -1) {
      ctrl.keys.splice(indx, 1);
    } else {
      ctrl.keys.push(key);
    }
    console.log(ctrl.allSeries);
  }
}

angular
  .module('tsa')
  .controller('GraphController', GraphController)
