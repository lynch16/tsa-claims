function GraphService($filter) {
  const setSeries = (data) => {
    let series = []
    data.forEach((entry) => {
      for (let key in entry) {
        series.push(key);
      }
    });
    return series;
  }

  const setData = (dateRange, data) => {
    let extractedData = [];
    data.forEach((series) => {
      let results = []
      for (let key in series) {  //key is airline, airport, etc.
        dateRange.forEach((date) => {
          if (!!series[key][date]){ //see if that airline has a value for that month
            results.push(jStat.sum(series[key][date]).toFixed(2));
          } else {
            results.push(0) //otherwise, send 0
          }
          let d = new Date(parseInt(date)).getMonth() + ", " + new Date(parseInt(date)).getFullYear()
        })
      }
      extractedData.push(results) //build nested array
    });
    return extractedData
  }

  const setLabels = (labels) => {
    labels = labels.map((label) => {
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
      dates.push(current.valueOf());
      current = new Date(current);
      current = current.setMonth(current.getMonth() + 1);
    }
    return dates;
  }

  const configureValues = (groupedData) => {
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
    return data;
  }

  return {
    setSeries: setSeries,
    setData: setData,
    setLabels: setLabels,
    allDatesInRange: allDatesInRange,
    configureValues: configureValues
  }
}

angular
  .module('tsa')
  .service('GraphService', GraphService)
