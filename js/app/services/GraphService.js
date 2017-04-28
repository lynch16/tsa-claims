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

  const setTotalValues = (dateRange, data) => {
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
        })
      }
      extractedData.push(results) //build nested array
    });
    return extractedData
  }

  const setCountAverages = (labels, data) => {
    let avgCounts = [];
    let stdDevs = [];
    data.forEach((series) => {
      let results = [ [], [] ]
      for (let key in series) {  //key is airline, airport, etc.
        for (let i = 0; i < labels.length; i++) { //for each month in labels
          let monthlyCounts = [];
          for (let date in series[key]) {         //check all claims
            let month = new Date(parseInt(date)).getMonth();  //parse ms and store month
            if (month === i){                                //if claim month and current label are equal
              monthlyCounts.push(series[key][date].length); //add the number of claims
            }
          }
          let avg, stdev;
          if (monthlyCounts.length > 0) {
            avg = jStat.mean(monthlyCounts).toFixed(2)
            stdev = jStat.stdev(monthlyCounts).toFixed(2)
          } else {                                          //keep zeros for months with no claims
            avg = 0;
            stdev = 0;
          }
          results[0].push(avg)
          results[1].push(stdev)
        } //end labels loop
      }
      avgCounts.push(results[0]) //array of averages
      stdDevs.push(results[1]) //array of stdevs
    });
    return [avgCounts, stdDevs] //return as nested array per ChartJS
  }


  const setLabels = (labels) => {
    labels = labels.map((label) => {
      let d = new Date(label)
      return (d.getMonth() + 1) + ", " + d.getFullYear();
    });
    return labels;
  }

  const loadDateRange = (data) => {
    let dates = Object.keys($filter('groupBy')(data, 'Incident Date'));
    dates.sort((a, b) => {
      date1 = new Date(parseInt(a));
      date2 = new Date(parseInt(b));
      if (date1 > date2) return 1;
      if (date2 > date1) return -1;
      return 0
    });
    let min = jStat.min(dates); //min of date range of claims
    let max = jStat.max(dates);
    let range = allDatesInRange(min, max); //array of dates in milliseconds since epoch
    return range;
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
        data.push({ [groupKey]: orderedGroup });
      }
    }
    return data;
  }

  return {
    setSeries: setSeries,
    setTotalValues: setTotalValues,
    setCountAverages: setCountAverages,
    setLabels: setLabels,
    loadDateRange: loadDateRange,
    allDatesInRange: allDatesInRange,
    configureValues: configureValues
  }
}

angular
  .module('tsa')
  .service('GraphService', GraphService)
