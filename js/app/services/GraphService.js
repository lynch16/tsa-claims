function GraphService() {
  const setSeries = (data) => {
    let series = []
    data.forEach((entry) => {
      for (let key in entry) {
        series.push(key);
      }
    });
    return series;
  }

  const setData = (labels, data) => {
    let extractedData = [];
    data.forEach((dataset) => {
      let results = []
      for (let key in dataset) {  //key is airline, airport, etc.
        labels.forEach( (label, index)  => { //for each month on the graph
          if (!!dataset[key][index + 1]){ //see if that airline has a value for that month
            results.push(dataset[key][index+1]) //if so, add it
          } else {
            results.push(0) //otherwise, send 0
          }
        });
      }
      extractedData.push(results) //build nested array
    });
    return extractedData
  }

  return {
    setSeries: setSeries,
    setData: setData
  }
}

angular
  .module('tsa')
  .service('GraphService', GraphService)
