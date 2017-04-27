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

  const setLabels = (labels, rangeType = 'month') => {
    labels = labels.map((label) => {
      let d = new Date(label)
      if (rangeType === 'month'){
        return (d.getMonth() + 1) + ", " + d.getFullYear();
      } else if (rangeType === 'year') {
        return d.getFullYear();
      } else {
        return d.getDate() + ", " + (d.getMonth() + 1) + ", " + d.getFullYear();

      }
    });
    return labels
  }

  const allDatesInRange = (min, max, rangeType = 'month') => {
    let dates = [];
    let stop = new Date(parseInt(max));
    let current = new Date(parseInt(min));
    while (current <= stop) {
      dates.push(current.valueOf());
      current = new Date(current);
      if (rangeType === 'month'){
        current = current.setMonth(current.getMonth() + 1);
      } else if (rangeType === 'year') {
        current = current.setFullYear(current.getFullYear() + 1);
      } else {
        current = current.getDate() + 1;
      }
    }
    return dates;
  }

  const configureValues = (groupedData, dateType = 'month') => {
    let data = [];
    for (let groupKey in groupedData) {
      let orderedGroup = $filter('groupBy')(groupedData[groupKey], 'Incident Date', dateType);  //order data by date for chart
      if (!!orderedGroup) {
        for (let d in orderedGroup) {
          orderedGroup[d] = orderedGroup[d].map((claim) => {
            let val = parseFloat( claim['Close Amount'].replace('$', "").trim() );
            if (isNaN(val)) return 0;
            return val;
          });
        }
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
