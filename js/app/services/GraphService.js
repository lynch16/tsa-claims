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

  const setData = (data) => {
    let results = [];
    data.forEach((lineGraph) => {
      for (let key in lineGraph) {
        results.push(lineGraph[key])
      }
    });
     return results
  }

  return {
    setSeries: setSeries,
    setData: setData
  }
}

angular
  .module('tsa')
  .service('GraphService', GraphService)
