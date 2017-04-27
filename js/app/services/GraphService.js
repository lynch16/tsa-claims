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
        for (let date in dataset[key]) {
          if (!!dataset[key][date]){ //see if that airline has a value for that month
            results.push(jStat.sum(dataset[key][date]).toFixed(2));
          } else {
            results.push(0) //otherwise, send 0
          }
        }
      }
      extractedData.push(results) //build nested array
    });
    return extractedData
  }

  const setLabels = (labels) => {
    labels.map((label) => {
      let d = new Date(label)
      return (d.getMonth() + 1) + ", " + d.getFullYear();
    });
    return labels
  }

  const allDatesInRange = (min, max) => {
    let dates = [];
    let stop = new Date(parseInt(max));
    let current = new Date(parseInt(min));
    while (current <= stop) {
      dates.push(current);
      current = new Date(current);
      current = current.setMonth(current.getMonth() + 1);
    }
    return dates
  }

  return {
    setSeries: setSeries,
    setData: setData,
    setLabels: setLabels,
    allDatesInRange: allDatesInRange
  }
}

angular
  .module('tsa')
  .service('GraphService', GraphService)
